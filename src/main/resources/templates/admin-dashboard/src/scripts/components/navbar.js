// Component Navbar

function renderNavbar() {
  const navbar = document.getElementById("navbar")
  if (!navbar) return

  navbar.innerHTML = `
        <div class="navbar-brand">Admin Dashboard</div>
        <div class="navbar-menu">
            <a href="index.html" class="navbar-item">Trang Chủ</a>
            <a href="users.html" class="navbar-item">Người Dùng</a>
            <a href="products.html" class="navbar-item">Sản Phẩm</a>
            <a href="carts.html" class="navbar-item">Giỏ Hàng</a>
        </div>
        <div class="navbar-user">
            <div class="user-avatar">A</div>
            <span>Admin</span>
        </div>
    `
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", renderNavbar)
