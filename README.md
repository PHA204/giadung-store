# 📖 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY PROJECT GIA DỤNG STORE

## 📋 MỤC LỤC
2. [Cài đặt các công cụ cần thiết](#cài-đặt-các-công-cụ-cần-thiết)
3. [Cài đặt Database](#cài-đặt-database)
4. [Cài đặt Backend (Spring Boot)](#cài-đặt-backend-spring-boot)
5. [Cài đặt Frontend Admin (Angular)](#cài-đặt-frontend-admin-angular)
6. [Cài đặt Frontend Customer (Angular)](#cài-đặt-frontend-customer-angular)
7. [Chạy toàn bộ ứng dụng](#chạy-toàn-bộ-ứng-dụng)
8. [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)

---

### Phần mềm cần thiết:
- ✅ Java JDK 17 trở lên
- ✅ Node.js 18+ và npm
- ✅ MySQL 8.0+
- ✅ Git
- ✅ IDE: VS Code, IntelliJ IDEA, hoặc Eclipse

---

## 🔧 CÀI ĐẶT CÁC CÔNG CỤ CẦN THIẾT

### 1️⃣ Cài đặt Java JDK 17

#### Windows:
```bash
# Tải Java JDK 17 từ Oracle hoặc OpenJDK
https://www.oracle.com/java/technologies/downloads/#java17

# Sau khi cài xong, kiểm tra version:
java -version
```

#### macOS:
```bash
# Sử dụng Homebrew
brew install openjdk@17

# Kiểm tra
java -version
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install openjdk-17-jdk

# Kiểm tra
java -version
```

**Kết quả mong đợi:**
```
java version "17.0.x"
Java(TM) SE Runtime Environment
```

---

### 2️⃣ Cài đặt Node.js và npm

#### Windows:
```bash
# Tải Node.js từ trang chính thức
https://nodejs.org/

# Chọn phiên bản LTS (Long Term Support)
# Sau khi cài xong:
node -v
npm -v
```

#### macOS:
```bash
brew install node

# Kiểm tra
node -v
npm -v
```

#### Linux:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Kiểm tra
node -v
npm -v
```

**Kết quả mong đợi:**
```
v18.x.x (hoặc cao hơn)
9.x.x (hoặc cao hơn)
```

---

### 3️⃣ Cài đặt MySQL

#### Windows:
```bash
# Tải MySQL Community Server
https://dev.mysql.com/downloads/mysql/

# Chạy file cài đặt và làm theo hướng dẫn
# Ghi nhớ password root bạn đặt!
```

#### macOS:
```bash
brew install mysql

# Start MySQL
brew services start mysql

# Thiết lập password
mysql_secure_installation
```

#### Linux:
```bash
sudo apt update
sudo apt install mysql-server

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Thiết lập password
sudo mysql_secure_installation
```

**Kiểm tra MySQL:**
```bash
mysql -u root -p
# Nhập password đã đặt
```

---

### 4️⃣ Cài đặt Git

#### Windows:
```bash
# Tải từ
https://git-scm.com/download/win
```

#### macOS:
```bash
brew install git
```

#### Linux:
```bash
sudo apt install git
```

**Kiểm tra:**
```bash
git --version
```

---

## 🗄️ CÀI ĐẶT DATABASE

### Bước 1: Tạo Database

```bash
# Đăng nhập MySQL
mysql -u root -p

# Nhập password
```

```sql
-- Tạo database mới
CREATE DATABASE giadungstore_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Kiểm tra
SHOW DATABASES;

-- Thoát
EXIT;
```

### Bước 2: Tạo bảng và dữ liệu mẫu

**Tạo file `database_setup.sql`:**

```sql
USE giadungstore_DB;

-- Tạo bảng Users
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng Categories
CREATE TABLE categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Brands
CREATE TABLE brands (
    brand_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Products
CREATE TABLE products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category_id BIGINT,
    brand_id BIGINT,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
);

-- Tạo bảng Orders
CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'COD',
    shipping_address TEXT NOT NULL,
    current_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Tạo bảng Order Details
CREATE TABLE order_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Tạo bảng Cart Items
CREATE TABLE cart_items (
    cart_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Tạo bảng Reviews
CREATE TABLE reviews (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Insert dữ liệu mẫu
INSERT INTO users (full_name, email, password, phone_number, address, role) VALUES
('Admin User', 'admin@giadung.com', 'admin123', '0901234567', 'Hà Nội', 'admin'),
('Nguyễn Văn A', 'nguyenvana@gmail.com', '123456', '0912345678', 'TP.HCM', 'customer'),
('Trần Thị B', 'tranthib@gmail.com', '123456', '0923456789', 'Đà Nẵng', 'customer');

INSERT INTO categories (category_name, description) VALUES
('Đồ điện tử', 'Các sản phẩm điện tử gia dụng'),
('Đồ nội thất', 'Bàn ghế, tủ, giường...'),
('Đồ bếp', 'Dụng cụ nhà bếp'),
('Đồ trang trí', 'Tranh, đèn, đồ trang trí');

INSERT INTO brands (brand_name, description) VALUES
('Samsung', 'Thương hiệu điện tử Hàn Quốc'),
('LG', 'Thương hiệu điện tử Hàn Quốc'),
('Panasonic', 'Thương hiệu điện tử Nhật Bản'),
('Philips', 'Thương hiệu điện tử Hà Lan');

INSERT INTO products (product_name, category_id, brand_id, description, price, discount, stock_quantity, image_url) VALUES
('Tủ lạnh Samsung 200L', 1, 1, 'Tủ lạnh ngăn đá trên', 5500000, 10, 50, 'https://via.placeholder.com/300'),
('Máy giặt LG 8kg', 1, 2, 'Máy giặt cửa trước', 7000000, 15, 30, 'https://via.placeholder.com/300'),
('Nồi cơm điện Panasonic 1.8L', 3, 3, 'Nồi cơm điện tử', 1200000, 5, 100, 'https://via.placeholder.com/300'),
('Bàn ăn gỗ 6 ghế', 2, 4, 'Bàn ăn gỗ tự nhiên', 8500000, 20, 15, 'https://via.placeholder.com/300');
```

**Chạy file SQL:**

```bash
mysql -u root -p giadungstore_DB < database_setup.sql
```

**Hoặc trong MySQL:**
```sql
SOURCE /path/to/database_setup.sql;
```

---

## 🚀 CÀI ĐẶT BACKEND (SPRING BOOT)

### Bước 1: Clone hoặc tải project

```bash
# Nếu có Git repository
git clone <repository-url>

# Hoặc giải nén file zip đã tải
cd backend
```

### Bước 2: Cấu hình kết nối Database

**Mở file:** `backend/src/main/resources/application.properties`

```properties
# Cập nhật thông tin database của bạn
spring.datasource.url=jdbc:mysql://localhost:3306/giadungstore_DB?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE

# Các cấu hình khác giữ nguyên
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

⚠️ **LƯU Ý:** Thay `YOUR_MYSQL_PASSWORD_HERE` bằng password MySQL của bạn!

### Bước 3: Build và chạy Backend

#### Cách 1: Sử dụng Maven Wrapper (Khuyến nghị)

**Windows:**
```bash
cd backend
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

**macOS/Linux:**
```bash
cd backend
chmod +x mvnw
./mvnw clean install
./mvnw spring-boot:run
```

#### Cách 2: Sử dụng Maven (nếu đã cài)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

#### Cách 3: Chạy từ IDE

**IntelliJ IDEA:**
1. Mở folder `backend` trong IntelliJ
2. Đợi Maven import xong
3. Mở file `GiadungApplication.java`
4. Click nút ▶️ Run bên cạnh `public static void main`

**VS Code:**
1. Cài extension: "Spring Boot Extension Pack"
2. Mở folder `backend`
3. Nhấn `F5` hoặc Run → Start Debugging

### Bước 4: Kiểm tra Backend

**Mở trình duyệt, truy cập:**
```
http://localhost:8080/api/products
```

**Kết quả mong đợi:** JSON với danh sách sản phẩm

```json
{
  "products": [...],
  "currentPage": 0,
  "totalItems": 4,
  "totalPages": 1
}
```

✅ **Backend chạy thành công!**

---

## 🎨 CÀI ĐẶT FRONTEND ADMIN (ANGULAR)

### Bước 1: Di chuyển vào thư mục admin

```bash
cd giadung-admin
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

⏳ **Lưu ý:** Quá trình này có thể mất 2-5 phút tùy tốc độ mạng.

### Bước 3: Cấu hình API URL

**Mở file:** `giadung-admin/src/environments/environment.development.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

✅ **Đảm bảo `apiUrl` trùng với địa chỉ backend!**

### Bước 4: Chạy Admin Frontend

```bash
npm start
```

**Hoặc:**
```bash
ng serve
```

**Kết quả:**
```
✔ Browser application bundle generation complete.
✔ Compiled successfully.

** Angular Live Development Server is listening on localhost:4200 **
```

### Bước 5: Truy cập Admin Panel

Mở trình duyệt:
```
http://localhost:4200
```

✅ **Admin Frontend chạy thành công!**

---

## 🛍️ CÀI ĐẶT FRONTEND CUSTOMER (ANGULAR)

### Bước 1: Mở terminal mới và di chuyển

```bash
cd giadung-customer
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình API URL

**Mở file:** `giadung-customer/src/environments/environment.development.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### Bước 4: Chạy Customer Frontend

```bash
npm start -- --port 5500
```

**Hoặc:**
```bash
ng serve --port 5500
```

**Lưu ý:** Dùng port 4201 để tránh conflict với Admin (port 4200)

### Bước 5: Truy cập Customer Site

Mở trình duyệt:
```
http://localhost:5500
```

✅ **Customer Frontend chạy thành công!**

---

## 🎯 CHẠY TOÀN BỘ ỨNG DỤNG

### Tóm tắt các bước:

1. **Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

2. **Terminal 2 - Admin Frontend:**
```bash
cd giadung-admin
npm start
```

3. **Terminal 3 - Customer Frontend:**
```bash
cd giadung-customer
npm start -- --port 5500
```

### Danh sách URL:

| Ứng dụng | URL | Mô tả |
|----------|-----|-------|
| Backend API | http://localhost:8080 | Spring Boot REST API |
| Admin Panel | http://localhost:4200 | Quản lý admin |
| Customer Site | http://localhost:5500 | Trang khách hàng |

---

## 🔧 XỬ LÝ LỖI THƯỜNG GẶP

### ❌ Lỗi 1: MySQL Connection Failed

**Triệu chứng:**
```
java.sql.SQLException: Access denied for user 'root'@'localhost'
```

**Giải pháp:**
1. Kiểm tra MySQL đang chạy:
```bash
# Windows
net start MySQL80

# macOS/Linux
sudo systemctl status mysql
```

2. Kiểm tra username/password trong `application.properties`
3. Reset MySQL password nếu cần:
```bash
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

---

### ❌ Lỗi 2: Port 8080 already in use

**Triệu chứng:**
```
Port 8080 was already in use.
```

**Giải pháp:**

**Windows:**
```bash
# Tìm process đang dùng port 8080
netstat -ano | findstr :8080

# Kill process (thay PID bằng số tìm được)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Tìm và kill process
lsof -ti:8080 | xargs kill -9
```

**Hoặc thay đổi port trong `application.properties`:**
```properties
server.port=8081
```

---

### ❌ Lỗi 3: npm install fails

**Triệu chứng:**
```
npm ERR! code EACCES
```

**Giải pháp:**

```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Cài lại
npm install
```

---

### ❌ Lỗi 4: CORS Error trong browser

**Triệu chứng:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Giải pháp:**

Kiểm tra `SecurityConfig.java` có đủ origin:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:4200",  // Admin
    "http://localhost:4201",  // Customer
    "http://127.0.0.1:4200",
    "http://127.0.0.1:4201"
));
```

---

### ❌ Lỗi 5: Java version mismatch

**Triệu chứng:**
```
java.lang.UnsupportedClassVersionError
```

**Giải pháp:**

```bash
# Kiểm tra Java version
java -version

# Nếu không phải Java 17+, cài đặt lại Java 17
# Sau đó set JAVA_HOME
```

**Windows:**
```
JAVA_HOME=C:\Program Files\Java\jdk-17
```

**macOS/Linux:**
```bash
export JAVA_HOME=/path/to/jdk-17
```

---

## 📝 KIỂM TRA HOÀN TẤT

### Checklist:

- [ ] MySQL đang chạy và có database `giadungstore_DB`
- [ ] Backend chạy thành công tại `http://localhost:8080`
- [ ] Admin frontend chạy tại `http://localhost:4200`
- [ ] Customer frontend chạy tại `http://localhost:5500`
- [ ] Có thể truy cập API: `http://localhost:8080/api/products`
- [ ] Không có lỗi CORS trong console
- [ ] Có thể đăng ký/đăng nhập user

---

## 🎓 TÀI KHOẢN MẪU

**Admin:**
- Email: `admin@giadung.com`
- Password: `admin123`

**Customer:**
- Email: `nguyenvana@gmail.com`
- Password: `123456`

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề không giải quyết được:

1. Kiểm tra lại từng bước trong hướng dẫn
2. Đọc log error chi tiết trong terminal
3. Google thông báo lỗi cụ thể
4. Tìm kiếm trên Stack Overflow

---

## 🎉 CHÚC MỪNG!

Bạn đã cài đặt thành công Gia Dụng Store! 🎊

Giờ bạn có thể:
- ✅ Quản lý sản phẩm, đơn hàng trong Admin Panel
- ✅ Mua sắm như khách hàng trong Customer Site
- ✅ Phát triển thêm tính năng mới

**Happy Coding! 💻✨**
