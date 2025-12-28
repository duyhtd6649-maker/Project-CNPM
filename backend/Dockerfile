FROM python:3.12

RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000", "/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]