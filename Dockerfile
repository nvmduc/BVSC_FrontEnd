# Sử dụng hình ảnh Node để xây dựng ứng dụng Angular
FROM node:latest as build

# Đặt thư mục làm thư mục làm việc cho ứng dụng
WORKDIR /app

# Copy package.json và package-lock.json (hoặc yarn.lock) vào thư mục làm việc
COPY package*.json ./

# Cài đặt các gói phụ thuộc cho ứng dụng
RUN npm install

# Copy toàn bộ mã nguồn của ứng dụng vào thư mục làm việc
COPY . .

# Xây dựng ứng dụng Angular
RUN npm run build --configuration production

# Sử dụng hình ảnh Nginx để triển khai ứng dụng đã xây dựng
FROM nginx:latest

# Sao chép tệp cấu hình Nginx của bạn (nếu cần thiết) vào thư mục cấu hình Nginx
# Ví dụ:
# COPY nginx.conf /etc/nginx/nginx.conf

# Sao chép các tệp đã xây dựng từ giai đoạn trước vào thư mục Nginx's HTML
COPY --from=build /Users/ducmanh/Angular/BVSC-Meeting /usr/share/nginx/html

# Mở cổng 80 để cho Nginx lắng nghe
EXPOSE 80

# Chạy Nginx để phục vụ ứng dụng
CMD ["nginx", "-g", "daemon off;"]
