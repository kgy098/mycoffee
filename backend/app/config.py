"""Configuration module"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # Database
    db_host: str = "127.0.0.1"
    db_port: int = 3306
    db_user: str = "coffee"
    db_password: str = "dnjsxjcl591!"
    db_name: str = "coffee"
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_title: str = "MyCoffee.AI API"
    
    # CORS
    frontend_url: str = "https://mycoffeeai.connet.co.kr"
    
    # Security
    secret_key: str = "your_secret_key_change_in_production"

    # OpenAI (AI 스토리 생성, 없으면 기본 문구 사용)
    openai_api_key: str = ""

    class Config:
        env_file = ".env.local"
        case_sensitive = False
    
    @property
    def database_url(self) -> str:
        """Construct database URL for SQLAlchemy"""
        return f"mysql+pymysql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


@lru_cache
def get_settings() -> Settings:
    """Get application settings (cached)"""
    return Settings()
