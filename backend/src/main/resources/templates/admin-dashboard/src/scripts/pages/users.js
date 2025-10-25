// Logic cho trang Users

let currentEditingUserId = null
let allUsers = []

async function loadUsers() {
  try {
    showLoading("usersTable")
    allUsers = await getAllUsers()
    renderUsersTable(allUsers)
  } catch (error) {
    console.error("Error loading users:", error)
    showNotification("Lỗi khi tải danh sách người dùng", "error")
    document.getElementById("usersTable").innerHTML = 
      '<p style="text-align: center; padding: 20px; color: red;">❌ Lỗi khi tải dữ liệu. Vui lòng kiểm tra kết nối API.</p>'
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
                    <th>Số điện thoại</th>
                    <th>Vai Trò</th>
                    <th>Trạng thái</th>
                    <th>Ngày Tạo</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                ${users
                  .map(
                    (user) => `
                    <tr>
                        <td>${user.userId}</td>
                        <td>${user.fullName}</td>
                        <td>${user.email}</td>
                        <td>${user.phoneNumber || "N/A"}</td>
                        <td><span class="badge ${user.role === "admin" ? "badge-danger" : "badge-info"}">${user.role || "customer"}</span></td>
                        <td><span class="badge ${user.isActive ? "badge-success" : "badge-danger"}">${user.isActive ? "Hoạt động" : "Khóa"}</span></td>
                        <td>${formatDate(user.createdAt)}</td>
                        <td>
                            <div class="table-actions">
                                <button class="action-btn action-btn-edit" onclick="editUser(${user.userId})">Sửa</button>
                                <button class="action-btn action-btn-delete" onclick="deleteUserHandler(${user.userId})">Xóa</button>
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
  const user = allUsers.find((u) => u.userId === id)
  if (!user) return

  currentEditingUserId = id
  document.getElementById("userModalTitle").textContent = "Sửa Người Dùng"
  document.getElementById("userName").value = user.fullName
  document.getElementById("userEmail").value = user.email
  document.getElementById("userPhone").value = user.phoneNumber || ""
  document.getElementById("userAddress").value = user.address || ""
  document.getElementById("userRole").value = user.role || "customer"
  document.getElementById("userPassword").value = ""
  document.getElementById("userPassword").required = false
  openModal("userModal")
}

async function deleteUserHandler(id) {
  if (confirmAction("Bạn có chắc chắn muốn xóa người dùng này?")) {
    try {
      await deleteUser(id)
      showNotification("Xóa người dùng thành công!", "success")
      loadUsers()
    } catch (error) {
      showNotification("Lỗi khi xóa người dùng", "error")
    }
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load users khi trang tải xong
  loadUsers()

  // Thêm người dùng
  const addUserBtn = document.getElementById("addUserBtn")
  if (addUserBtn) {
    addUserBtn.addEventListener("click", () => {
      currentEditingUserId = null
      document.getElementById("userModalTitle").textContent = "Thêm Người Dùng"
      clearForm("userForm")
      document.getElementById("userPassword").required = true
      openModal("userModal")
    })
  }

  // Đóng modal
  const closeUserModal = document.getElementById("closeUserModal")
  if (closeUserModal) {
    closeUserModal.addEventListener("click", () => {
      closeModal("userModal")
    })
  }

  // Submit form
  const userForm = document.getElementById("userForm")
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      
      const formData = {
        fullName: document.getElementById("userName").value,
        email: document.getElementById("userEmail").value,
        phoneNumber: document.getElementById("userPhone").value,
        address: document.getElementById("userAddress").value,
        role: document.getElementById("userRole").value,
      }
      
      const password = document.getElementById("userPassword").value
      if (password) {
        formData.password = password
      }

      try {
        if (currentEditingUserId) {
          await updateUser(currentEditingUserId, formData)
          showNotification("Cập nhật người dùng thành công!", "success")
        } else {
          await createUser(formData)
          showNotification("Thêm người dùng thành công!", "success")
        }
        closeModal("userModal")
        loadUsers()
      } catch (error) {
        showNotification("Có lỗi xảy ra!", "error")
      }
    })
  }

  // Tìm kiếm
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.toLowerCase()
      const filtered = allUsers.filter(
        (user) =>
          user.fullName.toLowerCase().includes(keyword) ||
          user.email.toLowerCase().includes(keyword) ||
          (user.phoneNumber && user.phoneNumber.includes(keyword))
      )
      renderUsersTable(filtered)
    })
  }
})