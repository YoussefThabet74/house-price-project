from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "House Price Prediction API"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    class Config:
        env_file = ".env"

settings = Settings()


