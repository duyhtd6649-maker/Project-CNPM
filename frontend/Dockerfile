FROM node:22-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file định nghĩa thư viện trước để tận dụng cache
COPY package.json ./

# Cài đặt thư viện (npm install)
RUN npm install

# Copy toàn bộ code frontend vào
COPY . .

# Mở port 3000 (Port mặc định của React)
EXPOSE 3000

# Chạy server ở chế độ Development (để sửa code là web tự cập nhật)
CMD ["npm", "start"]