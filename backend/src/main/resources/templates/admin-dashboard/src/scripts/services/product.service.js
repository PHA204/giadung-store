// Service cho Products - Xử lý logic liên quan đến sản phẩm

import { getAllProducts, createProduct, updateProduct, deleteProduct } from "./product.api"
import { showNotification } from "./notification.service"

class ProductService {
  constructor() {
    this.products = []
  }

  /**
   * Lấy danh sách sản phẩm
   */
  async fetchProducts() {
    try {
      this.products = await getAllProducts()
      return this.products
    } catch (error) {
      showNotification("Lỗi khi tải danh sách sản phẩm", "error")
      return []
    }
  }

  /**
   * Thêm sản phẩm
   */
  async addProduct(productData) {
    try {
      const newProduct = await createProduct(productData)
      this.products.push(newProduct)
      showNotification("Thêm sản phẩm thành công!", "success")
      return newProduct
    } catch (error) {
      showNotification("Lỗi khi thêm sản phẩm", "error")
      throw error
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  async updateProductData(id, productData) {
    try {
      const updatedProduct = await updateProduct(id, productData)
      const index = this.products.findIndex((p) => p.id === id)
      if (index !== -1) {
        this.products[index] = updatedProduct
      }
      showNotification("Cập nhật sản phẩm thành công!", "success")
      return updatedProduct
    } catch (error) {
      showNotification("Lỗi khi cập nhật sản phẩm", "error")
      throw error
    }
  }

  /**
   * Xóa sản phẩm
   */
  async removeProduct(id) {
    try {
      await deleteProduct(id)
      this.products = this.products.filter((p) => p.id !== id)
      showNotification("Xóa sản phẩm thành công!", "success")
    } catch (error) {
      showNotification("Lỗi khi xóa sản phẩm", "error")
      throw error
    }
  }

  /**
   * Tìm kiếm sản phẩm
   */
  searchProducts(keyword) {
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.description.toLowerCase().includes(keyword.toLowerCase()),
    )
  }

  /**
   * Tính giá sau giảm
   */
  calculateDiscountedPrice(price, discount) {
    return price * (1 - discount / 100)
  }
}

const productService = new ProductService()
