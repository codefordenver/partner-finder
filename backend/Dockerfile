FROM python:3.9

WORKDIR /app

COPY requirements-prod.txt .
RUN pip install --upgrade pip &&\
    pip install -q --no-cache-dir -r requirements-prod.txt

COPY . .

RUN pip install -e .

# ENTRYPOINT ["gunicorn", "main:app", "-w", "1", "--threads", "1", "-b", "0.0.0.0:8000"]
