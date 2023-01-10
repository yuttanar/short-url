# Fullstack Exam

## Exam
### 1. System Design
จงออกแบบระบบย่อ URL พร้อม demo
เช่น ย่อ http://my-order.ai/long-url/very-sub-path ให้เป็น http://shorturl.com/abcde
สามารถระบุรายละเอียด เช่น 
- database = redis เป็น in-memory database ดึงข้อมูลได้เร็ว (ใช้ตัวฟรีของ upstash.com)
- front-end = next-js เป็น SSR ซึ่งทำ OpenGraph ได้ง่าย เวลาแชร์ลิงค์ใน social media
- back-end = next-js/api มีมาให้ใน next-js อยู่แล้ว ไม่ต้องติดตั้งเพิ่ม ทำให้ใช้เวลาในการพัฒนาน้อย
- deployment ใช้ Vercel โดย trigger จาก github branch main เนื่องจากฟรี และใช้งานง่าย เพียงแค่ push code ขึ้น github


### 2. Up To You
จงออกแบบข้อสอบเอง พร้อมเฉลย อย่างน้อย 1 ข้อ
- LINE chat bot สำหรับ URL Shortener โดยส่ง url ที่ยาวเข้าไปที่แชท แล้ว bot จะตอบกลับมาด้วย url ที่ทำให้สั้นแล้ว
- ใช้เครื่องมือฟรีทั้งหมด
- ใช้ร่วมกับโปรเจคในข้อที่ 1 ได้

## Deployment
- เมื่อทำเสร็จให้ push code ไปที่ Repository ของตนเอง แล้วแนบ Url ตอบกลับ Email บริษัท
- เมื่อบริษัทตรวจสอบเรียบร้อย จะนัดหมายผู้มาทดสอบเพื่อสัมภาษณ์ผ่าน Video Conference ต่อไป

## Problem ?
หากต้องการ Requirement เพิ่มเติม หรือมีข้อสงสัย ให้ติดต่อกลับโดยด่วน ผ่านช่องทางดังนี้
- phattharaphon@myorder.ai
- sompob@myorder.ai
- traiwit@myorder.ai