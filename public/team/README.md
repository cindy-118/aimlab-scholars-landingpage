# Chèn ảnh đội ngũ

Hai file SVG hiện tại chỉ là khung ảnh tạm, không phải ảnh chân dung thật.

1. Đặt ảnh thật vào thư mục `public/team/`, ví dụ:
   - `can-tran-thanh-trung.png`
   - `nguyen-ho-thang-long.png`
2. Mở `src/routes/index.tsx`, tìm `academicTeam`.
3. Đổi hai giá trị `portrait` từ đuôi `.svg` thành `.png` (hoặc `.jpg` / `.webp` đúng với file của bạn).

Ảnh tự lấp đầy khung dọc nhỏ cạnh tên: 104 × 128 px trên máy tính, 80 × 104 px trên điện thoại. Có thể chỉnh `object-position` trong `.team-portrait img` tại `src/styles.css` nếu cần căn khuôn mặt.
