// app/(admin)/admin/layout.tsx
'use client'

import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ส่งต่อให้ AdminLayout component จัดการทั้งหมด
  return <AdminLayout>{children}</AdminLayout>
}
