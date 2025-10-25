// Cấu hình API
const API_CONFIG = {
  BASE_URL: "http://localhost:8080/api",
  TIMEOUT: 5000,
  HEADERS: {
    "Content-Type": "application/json",
  },
}

// Endpoints
const API_ENDPOINTS = {
  USERS: "/users",
  PRODUCTS: "/products",
  CARTS: "/cart",
  BRANDS: "/brands",
  CATEGORIES: "/categories",
}

// Thông báo
const MESSAGES = {
  SUCCESS: "Thành công!",
  ERROR: "Có lỗi xảy ra!",
  CONFIRM_DELETE: "Bạn có chắc chắn muốn xóa?",
  LOADING: "Đang tải...",
}