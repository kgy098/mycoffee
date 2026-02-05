# MyCoffee.AI Backend

Python FastAPI backend for MyCoffee.AI application.

## Project Structure

```
app/
├── models/           # SQLAlchemy ORM models
├── schemas/          # Pydantic request/response schemas
├── routes/           # API endpoint routes
├── services/         # Business logic services
├── utils/            # Helper utilities
├── config.py         # Configuration management
├── database.py       # Database connection
└── main.py           # FastAPI application entry point

tests/                # Unit and integration tests
```

## Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Copy `.env.local` and update database credentials:
```bash
cp .env.local .env.local
# Edit .env.local with your database details
```

### 4. Run Application
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`
Swagger UI: `http://localhost:8000/docs`

## Database

### SQL Schema
The database schema is defined in: `../mycoffeeai-front/db/create_mariadb_tables.sql`

Run the schema:
```bash
mysql -u root -p mycoffeeai < ../mycoffeeai-front/db/create_mariadb_tables.sql
```

## API Endpoints

### Health Check
- `GET /health` - Health check

### Blends
- `GET /api/blends` - List all blends
- `GET /api/blends/{blend_id}` - Get blend by ID
- `POST /api/blends` - Create blend (Admin)
- `PUT /api/blends/{blend_id}` - Update blend (Admin)

## Technologies

- **FastAPI** - Modern web framework
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **PyMySQL** - MySQL driver
- **Uvicorn** - ASGI server

## License

MIT
