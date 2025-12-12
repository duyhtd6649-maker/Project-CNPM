# Sử dụng Python bản ổn định
FROM python:3.11-slim

# Thiết kế thư mục làm việc
WORKDIR /app

# CÀI ĐẶT CÁC THƯ VIỆN HỆ THỐNG CẦN THIẾT CHO MYSQLCLIENT
RUN apt-get update && apt-get install -y \
    pkg-config \
    gcc \
    default-libmysqlclient-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy file thư viện vào và cài đặt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code vào container
COPY . .

# Lệnh chạy mặc định
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]