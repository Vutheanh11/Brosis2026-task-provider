# Brosis-FrontEnd

Ứng dụng giao và quản lý công việc gồm React frontend và Node/Express backend.

## Chạy local

Terminal 1:

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Terminal 2:

```bash
copy .env.example .env
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:10000/api`

## Tài khoản demo

- Admin: `admin@taskflow.vn` / `123456`
- User: `user@taskflow.vn` / `123456`

## Deploy frontend lên GitHub Pages

Frontend production đã được nối với:

```text
https://brosis-backend.onrender.com/api
```

Mỗi lần push lên branch `main`, workflow `.github/workflows/deploy-pages.yml` sẽ tự build và deploy frontend. Trong GitHub vào **Settings > Pages**, chọn **Source: GitHub Actions**.

URL frontend:

```text
https://vutheanh11.github.io/Brosis2026-task-provider/
```

Cập nhật biến `FRONTEND_URL` của service backend trên Render thành `https://vutheanh11.github.io`, rồi redeploy backend.

## Backend

Backend là project độc lập trong thư mục `Brosis-BackEnd`. Bạn có thể push riêng nội dung thư mục đó lên một GitHub repository; file `Brosis-BackEnd/render.yaml` sẽ tạo Web Service trên Render. Xem hướng dẫn chi tiết trong `Brosis-BackEnd/README.md`.

Backend sử dụng Persistent Disk 1 GB để giữ dữ liệu. Nếu tài khoản Render không hỗ trợ disk, xóa khối `disk` và đổi `DATA_FILE` thành `./data/db.json`; ứng dụng vẫn chạy nhưng dữ liệu có thể mất khi Render khởi động lại hoặc deploy mới.
