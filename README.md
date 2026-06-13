# 🤖 Teddy Bot V2 - Panel Quản Lý

> **Tác giả:** Wen Lin &nbsp;|&nbsp; **Phiên bản:** 2.0.0 &nbsp;|&nbsp; **Công nghệ:** Node.js + Express + Liquid Glass UI

---

## 📋 Mục Lục

1. [Giới Thiệu](#-giới-thiệu)
2. [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
3. [Cài Đặt & Khởi Động](#-cài-đặt--khởi-động)
4. [Đăng Nhập Hệ Thống](#-đăng-nhập-hệ-thống)
5. [Quản Lý Cookie/Appstate](#-quản-lý-cookieappstate)
6. [Điều Khiển Bot](#-điều-khiển-bot)
7. [Trình Phát Nhạc](#-trình-phát-nhạc)
8. [Tiers & Quyền Truy Cập](#-tiers--quyền-truy-cập)
9. [Quản Lý Cấu Hình](#-quản-lý-cấu-hình)
10. [Quản Lý Lệnh Bot](#-quản-lý-lệnh-bot)
11. [Xem Danh Sách Nhóm](#-xem-danh-sách-nhóm)
12. [Cập Nhật Bot](#-cập-nhật-bot)
13. [Câu Hỏi Thường Gặp](#-câu-hỏi-thường-gặp)

---

## 💡 Giới Thiệu

**Teddy Bot V2** là một bộ điều khiển bot Facebook Messenger toàn diện với giao diện web hiện đại sử dụng thiết kế **Liquid Glass Dark Mode**. Hệ thống được xây dựng bằng **Node.js** và cung cấp:

- 🎨 Giao diện **Glassmorphism** đẹp mắt
- 🔐 Hệ thống **4-tier authentication** (Member → VIP → Admin → Owner)
- 🎵 Trình phát nhạc YouTube tích hợp
- 🔑 Quản lý **upgrade keys** an toàn
- 🚀 Điều khiển bot từ xa qua web
- 📊 Dashboard thống kê chi tiết

---

## 📦 Yêu Cầu Hệ Thống

- **Node.js** `16.x` trở lên (khuyến nghị `18.x` hoặc `22.x`)
- **npm** hoặc **yarn** `8.x+`
- **Internet** ổn định
- **Key kích hoạt** hợp lệ (được cấp bởi Wen Lin)

---

## 🚀 Cài Đặt & Khởi Động

### Bước 1: Clone & Cài Đặt
```bash
# Clone dự án
git clone <repo-url>
cd teddy-v2

# Cài đặt dependencies
npm install

# Khởi động bot
npm run start
```

### Bước 2: Truy Cập
Mở trình duyệt và truy cập: **`http://localhost:3000`**

> **Lưu ý:** Đảm bảo cổng 3000 không bị chiếm bởi ứng dụng khác.

---

## 🔑 Đăng Nhập Hệ Thống

Lần đầu truy cập, bạn sẽ thấy **Modal Đăng Nhập** với giao diện Liquid Glass.

### Cách Đăng Nhập:
1. Nhập **Key Kích Hoạt** (được Wen Lin cung cấp)
2. Nhấn **Đăng Nhập**
3. Hệ thống sẽ xác minh và cấp quyền theo tier của key

### Các Loại Key:
- **MEMBER-**: Quyền truy cập cơ bản
- **VIP-**: Quyền nâng cao (3 tài khoản)
- **ADMIN-**: Quyền quản lý hệ thống
- **OWNER-**: Quyền tối cao (Wen Lin)

---

## 🍪 Quản Lý Cookie/Appstate

Bot cần Facebook Cookie để hoạt động. Làm theo hướng dẫn:

### Lấy Cookie:
1. Đăng nhập **Facebook** trên trình duyệt máy tính
2. Cài đặt extension: **EditThisCookie** hoặc **Cookie-Editor**
3. Click extension → **Export** → Chọn **JSON** format
4. Copy toàn bộ JSON (phải là `[...]`)

### Nhập vào Panel:
1. Vào tab **🔑 Cookie**
2. Xoá nội dung cũ hoàn toàn
3. Dán JSON cookie vào ô trống
4. Nhấn **💾 Lưu Appstate**
5. Sau đó **khởi động lại bot**

> ⚠️ **Lưu ý:** Cookie hết hạn trong 1-2 tuần. Nếu bot bị offline, hãy cập nhật cookie mới.

---

## ▶️ Điều Khiển Bot

Vào tab **📊 Dashboard** để quản lý trạng thái bot:

| Chức Năng | Mô Tả |
|-----------|-------|
| **▶ Khởi Động** | Bật bot và kết nối Facebook |
| **⏹ Dừng** | Tắt bot an toàn |
| **🔄 Kiểm Tra Cập Nhật** | Tìm phiên bản mới nhất |
| **Trạng Thái** | Hiển thị bot đang chạy (🟢) hay offline (🔴) |

> Sau khi thay cookie hoặc cấu hình, luôn **dừng rồi khởi động lại** để áp dụng.

---

## 🎵 Trình Phát Nhạc

**Teddy Bot V2** tích hợp trình phát nhạc YouTube - Wen Lin (Owner) có thể thêm bài hát tùy ý.

### Chức Năng:
- 🎵 **Phát/Tạm Dừng** - Điều khiển phát nhạc
- ⏭️ **Tiếp Theo** - Chuyển đến bài hát tiếp theo
- ⏮️ **Quay Lại** - Quay lại bài hát trước
- 📊 **Thanh Tiến Trình** - Kéo thanh để tua
- 📋 **Danh Sách Phát** - Xem toàn bộ bài hát

### Thêm Bài Hát (Owner Only):
1. Vào tab **🎵 Nhạc**
2. Nhấn **+ Thêm Bài**
3. Dán link YouTube
4. Bài hát sẽ tự động thêm vào danh sách

> 🔓 **Ai cũng có thể nghe** - Không cần login để phát nhạc.

---

## 👥 Tiers & Quyền Truy Cập

Hệ thống sử dụng **4-tier authentication** để kiểm soát quyền truy cập:

| Tier | Tên | Quyền | Giới Hạn |
|------|-----|-------|---------|
| **1** | **Member** | Xem thông tin cơ bản | 1 tài khoản |
| **2** | **VIP** | Toàn bộ tính năng Member | 3 tài khoản |
| **3** | **Admin** | Quản lý bot, tạo keys | Không giới hạn |
| **4** | **Owner** | Tối cao - Wen Lin | Tất cả |

### Nâng Cấp Tier:
- Admin/Owner có thể **tạo key nâng cấp** cho user
- User dùng key đó để **login lại** và nâng tier
- Key **chỉ dùng một lần** rồi khóa tự động

---

## ⚙️ Quản Lý Cấu Hình

### Thay Đổi Cấu Hình:
1. Vào tab **⚙️ Cài Đặt**
2. Chỉnh sửa các trường cần thiết
3. Nhấn **💾 Lưu Cấu Hình**
4. **Khởi động lại bot** để áp dụng

### Các Cấu Hình Chính:
- **Tên Bot** - Hiển thị trong Messenger
- **Prefix Lệnh** - Ký tự kích hoạt lệnh (mặc định: `.`)
- **Ngôn Ngữ** - Tiếng Việt / Tiếng Anh
- **Chế Độ** - Debug / Production

---

## 📜 Quản Lý Lệnh Bot

### Duyệt Lệnh:
1. Vào tab **📝 Commands**
2. Chọn **thư mục danh mục** (e.g., `Admin/`, `Fun/`)
3. Click vào file lệnh để xem mã nguồn
4. Sửa nếu cần, nhấn **💾 Lưu**
5. Nhấn **← Quay Lại** để trở về danh sách

### Cấu Trúc Lệnh:
```javascript
// module/commands/Admin/Example.js
export default {
  name: 'example',
  description: 'Mô tả lệnh',
  admin: true,
  execute: async (api, event, args) => {
    // Mã lệnh ở đây
  }
}
```

---

## 📦 Xem Danh Sách Nhóm

Tab **📦 Box** hiển thị tất cả nhóm chat bot đang tham gia:

| Thông Tin | Mô Tả |
|-----------|-------|
| **Tên Nhóm** | Tên cuộc trò chuyện |
| **Loại** | Nhóm / Tin Nhắn Riêng |
| **Thành Viên** | Số người trong nhóm |
| **ThreadID** | ID duy nhất của nhóm |

---

## 🔄 Cập Nhật Bot

Để cập nhật lên phiên bản mới:

1. Vào tab **📊 Dashboard**
2. Nhấn **🔄 Kiểm Tra Cập Nhật**
3. Nếu có bản mới, xác nhận trong hộp thoại
4. Chờ cập nhật hoàn tất rồi bấm **OK**

> ✅ **Cookie & Config sẽ được giữ nguyên** sau cập nhật.

---

## ❓ Câu Hỏi Thường Gặp

### Giao diện không tải được
- Kiểm tra server đang chạy: `npm run start`
- Thử truy cập: `http://localhost:3000`
- Nếu khác port, kiểm tra output terminal

### Bot không phản hồi trong Messenger
- Cookie có thể đã hết hạn → Cập nhật cookie mới
- Kiểm tra **Trạng Thái** xem bot có đang chạy không
- Khởi động lại bot

### Lỗi "Key không hợp lệ"
- Key chỉ dùng một lần duy nhất
- Liên hệ **Wen Lin** để lấy key mới
- Kiểm tra copy-paste đúng không (có khoảng trắng không?)

### Appstate hiện cảnh báo vàng
- Cookie chưa đúng JSON format `[...]`
- Xuất lại từ extension, chọn **JSON format**
- Đảm bảo toàn bộ là JSON array

### Bot liên tục offline
- Kiểm tra kết nối Internet
- Cookie đã hết hạn → Lấy cookie mới
- Thử khởi động lại từ Dashboard

### Sao không thể thêm nhạc?
- Chỉ **Owner (Wen Lin)** mới có quyền thêm nhạc
- Nếu bạn là Admin, yêu cầu nâng lên Owner
- Kiểm tra link YouTube có hợp lệ không

### Quên key/không thể login
- Liên hệ **Wen Lin** để lấy key mới
- Xoá localStorage rồi reload trang

---

## 📞 Liên Hệ & Hỗ Trợ

👤 **Chủ Sở Hữu:** Wen Lin  
📧 **Facebook:** Wen Lin  
🐛 **Báo Cáo Lỗi:** Liên hệ trực tiếp Wen Lin

Vui lòng cung cấp:
- Hệ điều hành (Windows/Mac/Linux)
- Phiên bản Node.js (`node -v`)
- Mô tả lỗi chi tiết
- Terminal error message

---

## 📝 Ghi Chú Cập Nhật

### v2.0.0 (Hiện Tại)
- ✨ Thiết kế **Liquid Glass Dark Mode** mới
- 🔐 Hệ thống **4-tier authentication** toàn diện
- 🎵 Trình phát nhạc YouTube tích hợp
- 🔑 Quản lý **upgrade keys** an toàn
- 📊 Dashboard tối ưu với Web Vitals cao
- 🚀 Cải thiện hiệu suất toàn bộ

---

*© 2025 Wen Lin — Teddy Bot V2*  
*Quyền bản quyền được bảo vệ. Vui lòng không sao chép hoặc phân phối lại.*
