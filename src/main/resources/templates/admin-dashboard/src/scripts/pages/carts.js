// Logic cho trang Carts

// Declare variables before using them
const showLoading = (elementId) => {
  document.getElementById(elementId).innerHTML = '<p style="text-align: center; padding: 20px;">Loading...</p>'
}

const cartService = {
  fetchCarts: async () => {
    // Mock implementation
    return [
      { id: 1, user: { name: "User 1" }, items: [{ price: 100 }, { price: 200 }], createdAt: new Date() },
      { id: 2, user: { name: "User 2" }, items: [{ price: 150 }], createdAt: new Date() },
    ]
  },
  calculateCartTotal: (cart) => {
    return cart.items.reduce((total, item) => total + item.price, 0)
  },
  removeCart: async (id) => {
    // Mock implementation
    console.log(`Cart with ID ${id} removed`)
  },
  searchCarts: (keyword) => {
    // Mock implementation
    return []
  },
}

const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
}

const formatDate = (date) => {
  return date.toLocaleDateString("vi-VN")
}

const confirmAction = (message) => {
  return window.confirm(message)
}

function renderCartsTable(carts) {
  const table = document.getElementById("cartsTable")
  if (carts.length === 0) {
    table.innerHTML = '<p style="text-align: center; padding: 20px;">Không có giỏ hàng nào</p>'
    return
  }

  table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Người Dùng</th>
                    <th>Số Mục</th>
                    <th>Tổng Giá</th>
                    <th>Ngày Tạo</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                ${carts
                  .map(
                    (cart) => `
                    <tr>
                        <td>${cart.id}</td>
                        <td>${cart.user ? cart.user.name : "N/A"}</td>
                        <td>${cart.items ? cart.items.length : 0}</td>
                        <td>${formatCurrency(cartService.calculateCartTotal(cart))}</td>
                        <td>${formatDate(cart.createdAt)}</td>
                        <td>
                            <div class="table-actions">
                                <button class="action-btn action-btn-delete" onclick="deleteCartHandler(${cart.id})">Xóa</button>
                            </div>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `
}

async function deleteCartHandler(id) {
  if (confirmAction("Bạn có chắc chắn muốn xóa giỏ hàng này?")) {
    await cartService.removeCart(id)
    loadCarts()
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadCarts()

  // Tìm kiếm
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const keyword = e.target.value
    const results = cartService.searchCarts(keyword)
    renderCartsTable(results)
  })
})

async function loadCarts() {
  try {
    showLoading("cartsTable")
    const carts = await cartService.fetchCarts()
    renderCartsTable(carts)
  } catch (error) {
    console.error("Error loading carts:", error)
  }
}
