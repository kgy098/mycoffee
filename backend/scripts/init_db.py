"""Initialize database by executing the SQL schema file.

Usage:
  python scripts/init_db.py

This script reads DB connection info from `.env.local` (loaded via python-dotenv)
and executes the SQL statements in `mycoffeeai-front/db/create_mariadb_tables.sql`.
Be careful: this will create tables on the target database.
"""
from pathlib import Path
import os
import sys
import pymysql
from dotenv import load_dotenv


def load_env(env_path: Path):
    if env_path.exists():
        load_dotenv(env_path)
        print(f"Loaded environment from {env_path}")
    else:
        print(f"Warning: {env_path} not found. Using environment variables.")


def get_sql_file_path() -> Path:
    # workspace root is two parents up from backend/scripts
    root = Path(__file__).resolve().parents[2]
    sql_path = root / 'mycoffeeai-front' / 'db' / 'create_mariadb_tables.sql'
    return sql_path


def read_sql(sql_path: Path) -> str:
    if not sql_path.exists():
        print(f"SQL file not found: {sql_path}")
        sys.exit(1)
    return sql_path.read_text(encoding='utf-8')


def execute_sql(sql_text: str, conn):
    # Split statements on semicolon. Skip empty pieces.
    statements = [s.strip() for s in sql_text.split(';')]
    with conn.cursor() as cur:
        for stmt in statements:
            if not stmt:
                continue
            try:
                cur.execute(stmt)
            except Exception as e:
                print(f"Failed to execute statement: {e}\nStatement snippet: {stmt[:200]}")
                raise
    conn.commit()


def main():
    env_path = Path(__file__).resolve().parents[1] / '.env.local'
    load_env(env_path)

    host = os.getenv('DB_HOST')
    port = int(os.getenv('DB_PORT', '3306'))
    user = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    db = os.getenv('DB_NAME')

    if not all([host, port, user, password, db]):
        print('Missing DB configuration. Please set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME')
        sys.exit(1)

    sql_path = get_sql_file_path()
    sql_text = read_sql(sql_path)

    print(f"Connecting to {user}@{host}:{port}/{db} ...")
    try:
        conn = pymysql.connect(host=host, port=port, user=user, password=password, db=db, charset='utf8mb4')
    except Exception as e:
        print(f"Could not connect to DB: {e}")
        sys.exit(1)

    try:
        execute_sql(sql_text, conn)
        print('Database initialization completed successfully.')
    finally:
        conn.close()


if __name__ == '__main__':
    main()
