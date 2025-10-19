// API gọi cho Users

// Declare API_CONFIG and API_ENDPOINTS variables before using them
const API_CONFIG = {
  BASE_URL: "https://api.example.com",
  HEADERS: {
    "Content-Type": "application/json",
    Authorization: "Bearer your_token_here",
  },
}

const API_ENDPOINTS = {
  USERS: "/users",
}

/**
 * Lấy danh sách tất cả người dùng
 */
async function getAllUsers() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}`, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi lấy danh sách người dùng")
    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

/**
 * Lấy người dùng theo ID
 */
async function getUserById(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}/${id}`, {
      method: "GET",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi lấy thông tin người dùng")
    return await response.json()
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

/**
 * Tạo người dùng mới
 */
async function createUser(userData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}`, {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error("Lỗi khi tạo người dùng")
    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

/**
 * Cập nhật người dùng
 */
async function updateUser(id, userData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}/${id}`, {
      method: "PUT",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(userData),
    })
    if (!response.ok) throw new Error("Lỗi khi cập nhật người dùng")
    return await response.json()
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

/**
 * Xóa người dùng
 */
async function deleteUser(id) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}/${id}`, {
      method: "DELETE",
      headers: API_CONFIG.HEADERS,
    })
    if (!response.ok) throw new Error("Lỗi khi xóa người dùng")
    return await response.json()
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}
