@echo off
REM Start the FastAPI backend (Windows)
cd /d "%~dp0backend"
if not exist .venv (
  echo Creating Python virtual environment...
  python -m venv .venv
)
call .venv\Scripts\activate
echo Installing requirements...
pip install -r requirements.txt
echo Starting FastAPI on http://127.0.0.1:8000 ...
python run.py
