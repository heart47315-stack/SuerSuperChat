// โหลดค่าจากไฟล์ .env มาไว้ใน process.env อัตโนมัติ
// ทำให้สามารถใช้ตัวแปร DATABASE_URL ได้
import 'dotenv/config'

// นำเข้า defineConfig สำหรับสร้าง config ของ Prisma
// และ env สำหรับดึงค่า environment variable แบบ type-safe
import { defineConfig, env } from 'prisma/config'

// export ค่า config ออกไปให้ Prisma ใช้งาน
export default defineConfig({

  // ระบุตำแหน่งไฟล์ schema.prisma
  // ไฟล์นี้ใช้กำหนดโครงสร้างฐานข้อมูล (models, relations ฯลฯ)
  schema: 'prisma/schema.prisma',

  // ตั้งค่าการเก็บไฟล์ migration
  migrations: {
    // path ที่ Prisma จะสร้างและเก็บไฟล์ migration
    path: 'prisma/migrations',
  },

  // ตั้งค่าการเชื่อมต่อฐานข้อมูล
  datasource: {
    // ดึงค่า DATABASE_URL จาก .env
    // ตัวอย่าง DATABASE_URL:
    // postgresql://user:password@localhost:5432/mydb
    url: env('DATABASE_URL'),
  },
})