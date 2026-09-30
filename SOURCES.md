# Sources used in Section 01

## Evidence links embedded in the three titles

- `#1 ĐIỂM CHUẨN`: VietNamNet, “Các ngành có điểm chuẩn cao nhất 2026: AI lên ngôi...”  
  https://vietnamnet.vn/cac-nganh-co-diem-chuan-cao-nhat-2026-ai-len-ngoi-su-pham-va-quan-doi-van-hot-2544805.html
- `ĐÀO TẠO CHÍNH QUY`: Cổng Thông tin Chính phủ, Quyết định 2422/QĐ-BGDĐT về Khung nội dung giáo dục AI cho học sinh phổ thông  
  https://xaydungchinhsach.chinhphu.vn/quyet-dinh-so-2422-qd-bgddt-ve-khung-noi-dung-giao-duc-tri-tue-nhan-tao-ai-cho-hoc-sinh-pho-thong-119260820163256297.htm
- `ĐẤU TRƯỜNG HỌC THUẬT`: Báo Chính phủ, Việt Nam vào Top 4 Olympic AI quốc tế 2025  
  https://thanhnien.vn/bo-gd-dt-thuc-day-dua-tri-tue-nhan-tao-thanh-mon-thi-hoc-sinh-gioi-quoc-gia-185260811091345847.htm
- Related policy context for the HSGQG wording: Cục Quản lý Chất lượng, Bộ GD&ĐT  
  https://vqa.moet.gov.vn/vi/news/tin-tuc-su-kien/de-xuat-mot-so-diem-moi-trong-ky-thi-chon-hoc-sinh-gioi-quoc-gia-295.html

## Section 01 local image workflow

No stock/student photos are bundled or hotlinked in the interactive AiMLab model anymore.
The component reads exactly three local JPG files from `public/source-img/`:

- `mentor.jpg` — Mentor dẫn dắt, and the default image before hover
- `personalized.jpg` — Cá nhân hoá
- `community.jpg` — Cộng đồng

Replace those three files with your own artwork while keeping the filenames unchanged. No code edits are required.
Recommended size: 1600 × 1000 px, JPG, sRGB. Landscape crops work best because the frame uses `object-fit: cover`.

## Academic network logo sources

The Section 05 logo wall prioritises five environments requested for emphasis. Logos are loaded as SVG wordmarks on a white surface to avoid favicon-style coloured squares:

- California Institute of Technology — Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Caltech_Logo.svg
- Duke University — Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Duke_University_logo.svg
- Dublin City University — Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Dublin_City_University_Logo.svg
- Nanyang Technological University — file referenced by Wikipedia / Wikimedia Commons: https://en.wikipedia.org/wiki/Nanyang_Technological_University
- Vietnam National University, Ho Chi Minh City — Wikimedia Commons: https://commons.wikimedia.org/wiki/File:VNU-HCM_logo.svg

The logo wall describes educational/work environments represented within the network; it does not imply partnership, sponsorship or endorsement.
