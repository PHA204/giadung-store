// Service cho Carts - Xử lý logic liên quan đến giỏ hàng

import { getAllCarts, deleteCart } from "./api/cart.api"
import { showNotification } from "./utils/notification"

class CartService {
  constructor() {
    this.carts = []
  }

  /**
   * Lấy danh sách giỏ hàng
   */
  async fetchCarts() {
    try {
      this.carts = await getAllCarts()
      return this.carts
    } catch (error) {
      showNotification("Lỗi khi tải danh sách giỏ hàng", "error")
      return []
    }
  }

  /**
   * Xóa giỏ hàng
   */
  async removeCart(id) {
    try {
      await deleteCart(id)
      this.carts = this.carts.filter((c) => c.id !== id)
      showNotification("Xóa giỏ hàng thành công!", "success")
    } catch (error) {
      showNotification("Lỗi khi xóa giỏ hàng", "error")
      throw error
    }
  }

  /**
   * Tìm kiếm giỏ hàng
   */
  searchCarts(keyword) {
    return this.carts.filter(
      (cart) =>
        cart.id.toString().includes(keyword) ||
        (cart.user && cart.user.name.toLowerCase().includes(keyword.toLowerCase())),
    )
  }

  /**
   * Tính tổng giá trị giỏ hàng
   */
  calculateCartTotal(cart) {
    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }
}

const cartService = new CartService()
