// Service cho Users - Xử lý logic liên quan đến users

import { getAllUsers, createUser, updateUser, deleteUser } from "./api" // Import các hàm từ api
import { showNotification } from "./utils" // Import hàm showNotification từ utils

class UserService {
  constructor() {
    this.users = []
  }

  /**
   * Lấy danh sách người dùng
   */
  async fetchUsers() {
    try {
      this.users = await getAllUsers()
      return this.users
    } catch (error) {
      showNotification("Lỗi khi tải danh sách người dùng", "error")
      return []
    }
  }

  /**
   * Thêm người dùng
   */
  async addUser(userData) {
    try {
      const newUser = await createUser(userData)
      this.users.push(newUser)
      showNotification("Thêm người dùng thành công!", "success")
      return newUser
    } catch (error) {
      showNotification("Lỗi khi thêm người dùng", "error")
      throw error
    }
  }

  /**
   * Cập nhật người dùng
   */
  async updateUserData(id, userData) {
    try {
      const updatedUser = await updateUser(id, userData)
      const index = this.users.findIndex((u) => u.id === id)
      if (index !== -1) {
        this.users[index] = updatedUser
      }
      showNotification("Cập nhật người dùng thành công!", "success")
      return updatedUser
    } catch (error) {
      showNotification("Lỗi khi cập nhật người dùng", "error")
      throw error
    }
  }

  /**
   * Xóa người dùng
   */
  async removeUser(id) {
    try {
      await deleteUser(id)
      this.users = this.users.filter((u) => u.id !== id)
      showNotification("Xóa người dùng thành công!", "success")
    } catch (error) {
      showNotification("Lỗi khi xóa người dùng", "error")
      throw error
    }
  }

  /**
   * Tìm kiếm người dùng
   */
  searchUsers(keyword) {
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase()),
    )
  }
}

const userService = new UserService()
