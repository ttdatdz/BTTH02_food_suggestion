# Hướng dẫn chạy ứng dụng Gợi ý món ăn

## Các bước chạy ứng dụng

B1: Clone dự án về bằng câu lệnh:  
`git clone https://github.com/ttdatdz/BTTH02_food_suggestion.git`

B2: Mở dự án lên

B3: Vào folder `back-end`, mở terminal và chạy:  
`node app.js` để chạy server

B4: Vào folder `font-end`, mở terminal và chạy các lệnh sau:
npm i,
npm start

- `npm i`: để cài đặt các thư viện (dependencies) trong project  
- `npm start`: để khởi động ứng dụng

B5: Mở trình duyệt và tương tác với ứng dụng

---

## Các bước chạy trên SWI-Prolog Desktop

B1: Mở SWI-Prolog trên desktop

B2: Vào menu: **File → Consult → chọn file `recipes.pl`**  
→ Mục đích: nạp file Prolog để có thể sử dụng

B3: Chạy một trong các lệnh sau để kiểm thử:

---

**Lệnh 1:**
suggest_all_recipes([trung, hanh, com, 'ca rot'], Recipes).

Mục đích:
- Lấy danh sách đầy đủ các món có thể nấu từ nguyên liệu đầu vào
- Đã sắp xếp theo độ ưu tiên (món ít nguyên liệu hơn xếp trước)
- Dùng khi cần hiển thị toàn bộ kết quả cùng lúc (ví dụ: web/app)

---

**Lệnh 2:**
suggest_recipe_with_ingredients([trung, hanh], Recipe).

Mục đích:
- Kiểm tra từng món đơn lẻ có nấu được không
- Không sắp xếp theo độ ưu tiên
- Dùng để debug hoặc kiểm tra nhanh 1 món

---

**Lệnh 3:**
suggest_recipe_with_priority([trung, hanh, com, 'ca rot'], Recipe).

Mục đích:
- Lấy kết quả từng món một theo thứ tự ưu tiên
- Dùng cho API backend (trả về lần lượt từng món)
- Tiết kiệm bộ nhớ khi xử lý nhiều món
