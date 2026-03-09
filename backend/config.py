import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
GITHUB_USERNAME: str = os.getenv("GITHUB_USERNAME", "")
HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY", "")
FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
NEWSAPI_API_KEY: str = os.getenv("NEWSAPI_API_KEY", "")
