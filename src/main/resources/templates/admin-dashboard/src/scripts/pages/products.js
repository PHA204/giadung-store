// Logic cho trang Products

let currentEditingProductId = null

// Declare or import variables/functions here
const showLoading = (elementId) => {
  document.getElementById(elementId).innerHTML = "<div>Loading...</div>"
}

const productService = {
  fetchProducts: async () => {
    // Mock implementation
    return [
      { id: 1, name: "Product 1", price: 100, discount: 10, stock: 10, createdAt: new Date() },
      { id: 2, name: "Product 2", price: 200, discount: 0, stock: 0, createdAt: new Date() },
    ]
  },
  removeProduct: async (id) => {
    // Mock implementation
    console.log(`Product with id ${id} removed`)
  },
  updateProductData: async (id, data) => {
    // Mock implementation
    console.log(`Product with id ${id} updated with data`, data)
  },
  addProduct: async (data) => {
    // Mock implementation
    console.log(`New product added with data`, data)
  },
  searchProducts: (keyword) => {
    // Mock implementation
    return productService.products.filter((product) => product.name.includes(keyword))
  },
  products: [], // Placeholder for products
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const formatDate = (date) => {
  return date.toLocaleDateString("vi-VN")
}

const openModal = (modalId) => {
  document.getElementById(modalId).style.display = "block"
}

const confirmAction = (message) => {
  return confirm(message)
}

const clearForm = (formId) => {
  document.getElementById(formId).reset()
}

const closeModal = (modalId) => {
  document.getElementById(modalId).style.display = "none"
}

async function loadProducts() {
  try {
    showLoading("productsTable")
    const products = await productService.fetchProducts()
    renderProductsTable(products)
  } catch (error) {
    console.error("Error loading products:", error)
  }
}

function renderProductsTable(products) {
  const table = document.getElementById("productsTable")
  if (products.length === 0) {
    table.innerHTML = '<p style="text-align: center; padding: 20px;">Không có sản phẩm nào</p>'
    return
  }

  table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Giảm Giá</th>
                    <th>Tồn Kho</th>
                    <th>Ngày Tạo</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                ${products
                  .map(
                    (product) => `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${formatCurrency(product.price)}</td>
                        <td>${product.discount || 0}%</td>
                        <td>
                            <span class="badge ${product.stock > 0 ? "badge-success" : "badge-danger"}">
                                ${product.stock}
                            </span>
                        </td>
                        <td>${formatDate(product.createdAt)}</td>
                        <td>
                            <div class="table-actions">
                                <button class="action-btn action-btn-edit" onclick="editProduct(${product.id})">Sửa</button>
                                <button class="action-btn action-btn-delete" onclick="deleteProductHandler(${product.id})">Xóa</button>
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

function editProduct(id) {
  const product = productService.products.find((p) => p.id === id)
  if (!product) return

  currentEditingProductId = id
  document.getElementById("productModalTitle").textContent = "Sửa Sản Phẩm"
  document.getElementById("productName").value = product.name
  document.getElementById("productDescription").value = product.description
  document.getElementById("productPrice").value = product.price
  document.getElementById("productDiscount").value = product.discount || 0
  document.getElementById("productStock").value = product.stock
  openModal("productModal")
}

async function deleteProductHandler(id) {
  if (confirmAction("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    await productService.removeProduct(id)
    loadProducts()
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadProducts()

  // Thêm sản phẩm
  document.getElementById("addProductBtn").addEventListener("click", () => {
    currentEditingProductId = null
    document.getElementById("productModalTitle").textContent = "Thêm Sản Phẩm"
    clearForm("productForm")
    openModal("productModal")
  })

  // Đóng modal
  document.getElementById("closeProductModal").addEventListener("click", () => {
    closeModal("productModal")
  })

  // Submit form
  document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = {
      name: document.getElementById("productName").value,
      description: document.getElementById("productDescription").value,
      price: Number.parseFloat(document.getElementById("productPrice").value),
      discount: Number.parseFloat(document.getElementById("productDiscount").value) || 0,
      stock: Number.parseInt(document.getElementById("productStock").value),
    }

    if (currentEditingProductId) {
      await productService.updateProductData(currentEditingProductId, formData)
    } else {
      await productService.addProduct(formData)
    }

    closeModal("productModal")
    loadProducts()
  })

  // Tìm kiếm
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const keyword = e.target.value
    const results = productService.searchProducts(keyword)
    renderProductsTable(results)
  })
})
