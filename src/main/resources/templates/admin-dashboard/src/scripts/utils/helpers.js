// Hàm tiện ích chung

/**
 * Định dạng tiền tệ
 */
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

/**
 * Định dạng ngày tháng
 */
function formatDate(date) {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

/**
 * Hiển thị thông báo
 */
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === "success" ? "#10b981" : "#ef4444"};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-in-out;
    `
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 3000)
}

/**
 * Xác nhận hành động
 */
function confirmAction(message) {
  return confirm(message)
}

/**
 * Xóa dữ liệu form
 */
function clearForm(formId) {
  const form = document.getElementById(formId)
  if (form) form.reset()
}

/**
 * Hiển thị loading
 */
function showLoading(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.innerHTML = '<p style="text-align: center; padding: 40px; color: #6b7280;">⏳ Đang tải dữ liệu...</p>'
  }
}

/**
 * Ẩn modal
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("show")
  }
}

/**
 * Hiển thị modal
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("show")
  }
}

// Close modal khi click bên ngoài
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('show')
  }
}