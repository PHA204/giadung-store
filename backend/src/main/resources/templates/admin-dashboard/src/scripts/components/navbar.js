// Component Navbar

function renderNavbar() {
  const navbar = document.getElementById("navbar")
  if (!navbar) return

  navbar.innerHTML = `
        <div class="navbar-brand">
            <h2>Admin Dashboard</h2>
        </div>
        <div class="navbar-user">
            <div class="user-avatar">A</div>
            <span>Admin</span>
        </div>
    `
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", renderNavbar)