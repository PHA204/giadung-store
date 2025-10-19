// API gọi cho Products

// Declare API_CONFIG and API_ENDPOINTS variables
const API_CONFIG = {
  BASE_URL: "https://api.example.com/",
  HEADERS: {
    "Content-Type": "application/json",
    Authorization: "Bearer your_token_here",
  },
}

const API_ENDPOINTS = {
  PRODUCTS: "products",
}

/**
 * Lấy danh sách tất cả sản phẩm
 */
async function getAllProducts() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}`, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi lấy danh sách sản phẩm")
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

/**
 * Lấy sản phẩm theo ID
 */
async function getProductById(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi lấy thông tin sản phẩm")
    return await response.json()
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

/**
 * Tạo sản phẩm mới
 */
async function createProduct(productData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}`, {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(productData),
    })
    if (!response.ok) throw new Error("Lỗi khi tạo sản phẩm")
    return await response.json()
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

/**
 * Cập nhật sản phẩm
 */
async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: "PUT",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(productData),
    })
    if (!response.ok) throw new Error("Lỗi khi cập nhật sản phẩm")
    return await response.json()
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

/**
 * Xóa sản phẩm
 */
async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: "DELETE",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi xóa sản phẩm")
    return await response.json()
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}
