#! /bin/bash
black --target-version py39 --line-length 120 --exclude __pycache__ --exclude venv ./
python scripts/cleanup.py