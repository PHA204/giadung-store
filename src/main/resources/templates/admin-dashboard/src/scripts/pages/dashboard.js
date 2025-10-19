// Logic cho Dashboard

// Declare necessary variables and functions
const userService = {
  fetchUsers: async () => {
    // Mock implementation
    return Promise.resolve([])
  },
}

const productService = {
  fetchProducts: async () => {
    // Mock implementation
    return Promise.resolve([])
  },
}

const cartService = {
  fetchCarts: async () => {
    // Mock implementation
    return Promise.resolve([])
  },
  calculateCartTotal: (cart) => {
    // Mock implementation
    return 0
  },
}

const showLoading = (elementId) => {
  // Mock implementation
  console.log(`Loading ${elementId}...`)
}

const formatCurrency = (amount) => {
  // Mock implementation
  return amount.toString()
}

const showNotification = (message, type) => {
  // Mock implementation
  console.log(`${type}: ${message}`)
}

async function loadDashboard() {
  try {
    showLoading("statsGrid")

    // Lấy dữ liệu
    const users = await userService.fetchUsers()
    const products = await productService.fetchProducts()
    const carts = await cartService.fetchCarts()

    // Tính toán thống kê
    const totalUsers = users.length
    const totalProducts = products.length
    const totalCarts = carts.length
    const totalRevenue = carts.reduce((sum, cart) => {
      return sum + cartService.calculateCartTotal(cart)
    }, 0)

    // Render stats
    const statsGrid = document.getElementById("statsGrid")
    statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-label">Tổng Người Dùng</div>
                <div class="stat-value">${totalUsers}</div>
                <div class="stat-change">↑ 12% từ tháng trước</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Tổng Sản Phẩm</div>
                <div class="stat-value">${totalProducts}</div>
                <div class="stat-change">↑ 8% từ tháng trước</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Giỏ Hàng Hoạt Động</div>
                <div class="stat-value">${totalCarts}</div>
                <div class="stat-change">↑ 15% từ tháng trước</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Tổng Doanh Thu</div>
                <div class="stat-value">${formatCurrency(totalRevenue)}</div>
                <div class="stat-change">↑ 20% từ tháng trước</div>
            </div>
        `
  } catch (error) {
    console.error("Error loading dashboard:", error)
    showNotification("Lỗi khi tải bảng điều khiển", "error")
  }
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", loadDashboard)
