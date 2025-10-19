// Component Sidebar

function renderSidebar() {
  const sidebar = document.getElementById("sidebar")
  if (!sidebar) return

  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  sidebar.innerHTML = `
        <ul class="sidebar-menu">
            <li class="sidebar-item">
                <a href="index.html" class="sidebar-link ${currentPage === "index.html" ? "active" : ""}">
                    <span class="sidebar-icon">📊</span>
                    <span>Bảng Điều Khiển</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="users.html" class="sidebar-link ${currentPage === "users.html" ? "active" : ""}">
                    <span class="sidebar-icon">👥</span>
                    <span>Người Dùng</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="products.html" class="sidebar-link ${currentPage === "products.html" ? "active" : ""}">
                    <span class="sidebar-icon">📦</span>
                    <span>Sản Phẩm</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="carts.html" class="sidebar-link ${currentPage === "carts.html" ? "active" : ""}">
                    <span class="sidebar-icon">🛒</span>
                    <span>Giỏ Hàng</span>
                </a>
            </li>
        </ul>
    `
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", renderSidebar)
