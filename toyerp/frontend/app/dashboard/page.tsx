"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"
import { EmployeeManagement } from "@/components/employee-management"
import { UserApproval } from "@/components/user-approval"
import { AccountManagement } from "@/components/account-management"
import { JournalEntry } from "@/components/journal-entry"
import { InventoryManagement } from "@/components/inventory-management"
import { Reports } from "@/components/reports"

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [userRole] = useState("admin") // 실제로는 JWT에서 추출

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />
      case "employees":
        return <EmployeeManagement />
      case "user-approval":
        return <UserApproval />
      case "accounts":
        return <AccountManagement />
      case "journal":
        return <JournalEntry />
      case "inventory":
        return <InventoryManagement />
      case "reports":
        return <Reports />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} />
        <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
      </div>
    </div>
  )
}
