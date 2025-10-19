// API gọi cho Carts

// Declare API_CONFIG and API_ENDPOINTS variables
const API_CONFIG = {
  BASE_URL: "https://api.example.com",
  HEADERS: {
    "Content-Type": "application/json",
  },
}

const API_ENDPOINTS = {
  CARTS: "/carts",
}

/**
 * Lấy danh sách tất cả giỏ hàng
 */
async function getAllCarts() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CARTS}`, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi lấy danh sách giỏ hàng")
    return await response.json()
  } catch (error) {
    console.error("Error fetching carts:", error)
    throw error
  }
}

/**
 * Lấy giỏ hàng theo ID
 */
async function getCartById(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CARTS}/${id}`, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi lấy thông tin giỏ hàng")
    return await response.json()
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

/**
 * Xóa giỏ hàng
 */
async function deleteCart(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CARTS}/${id}`, {
      method: "DELETE",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi xóa giỏ hàng")
    return await response.json()
  } catch (error) {
    console.error("Error deleting cart:", error)
    throw error
  }
}
