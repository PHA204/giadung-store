// Logic cho trang Users

let currentEditingUserId = null
const showLoading = null
const userService = null
const formatDate = null
const openModal = null
const confirmAction = null
const clearForm = null
const closeModal = null

async function loadUsers() {
  try {
    showLoading("usersTable")
    const users = await userService.fetchUsers()
    renderUsersTable(users)
  } catch (error) {
    console.error("Error loading users:", error)
  }
}

function renderUsersTable(users) {
  const table = document.getElementById("usersTable")
  if (users.length === 0) {
    table.innerHTML = '<p style="text-align: center; padding: 20px;">Không có người dùng nào</p>'
    return
  }

  table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai Trò</th>
                    <th>Ngày Tạo</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                ${users
                  .map(
                    (user) => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td><span class="badge badge-info">${user.role || "USER"}</span></td>
                        <td>${formatDate(user.createdAt)}</td>
                        <td>
                            <div class="table-actions">
                                <button class="action-btn action-btn-edit" onclick="editUser(${user.id})">Sửa</button>
                                <button class="action-btn action-btn-delete" onclick="deleteUserHandler(${user.id})">Xóa</button>
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

function editUser(id) {
  const user = userService.users.find((u) => u.id === id)
  if (!user) return

  currentEditingUserId = id
  document.getElementById("userModalTitle").textContent = "Sửa Người Dùng"
  document.getElementById("userName").value = user.name
  document.getElementById("userEmail").value = user.email
  document.getElementById("userRole").value = user.role || "USER"
  document.getElementById("userPassword").value = ""
  openModal("userModal")
}

async function deleteUserHandler(id) {
  if (confirmAction("Bạn có chắc chắn muốn xóa người dùng này?")) {
    await userService.removeUser(id)
    loadUsers()
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadUsers()

  // Thêm người dùng
  document.getElementById("addUserBtn").addEventListener("click", () => {
    currentEditingUserId = null
    document.getElementById("userModalTitle").textContent = "Thêm Người Dùng"
    clearForm("userForm")
    openModal("userModal")
  })

  // Đóng modal
  document.getElementById("closeUserModal").addEventListener("click", () => {
    closeModal("userModal")
  })

  // Submit form
  document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = {
      name: document.getElementById("userName").value,
      email: document.getElementById("userEmail").value,
      password: document.getElementById("userPassword").value,
      role: document.getElementById("userRole").value,
    }

    if (currentEditingUserId) {
      await userService.updateUserData(currentEditingUserId, formData)
    } else {
      await userService.addUser(formData)
    }

    closeModal("userModal")
    loadUsers()
  })

  // Tìm kiếm
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const keyword = e.target.value
    const results = userService.searchUsers(keyword)
    renderUsersTable(results)
  })
})
