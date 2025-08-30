// app/(console)/layout.tsx  ✅ "use client" 삭제
import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"   // Sidebar는 client 컴포넌트여도 OK
import { Header } from "@/components/header"

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  const userRole = "admin" // 나중에 쿠키/서버에서 읽어도 됨(여기선 예시)
  const menu = [
    { href: "/console/dashboard", label: "대시보드", key: "dashboard" },
    // ...
  ]
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={userRole} menu={menu} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}