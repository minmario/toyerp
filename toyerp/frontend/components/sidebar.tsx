"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, BookOpen, FileText, Package, BarChart3, LogOut, Building2 } from "lucide-react"

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  userRole: string
}

export function Sidebar({ activeMenu, setActiveMenu, userRole }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "대시보드", icon: LayoutDashboard, roles: ["admin", "employee"] },
    { id: "employees", label: "사원 관리", icon: Users, roles: ["admin"] },
    { id: "accounts", label: "계정과목", icon: BookOpen, roles: ["admin", "employee"] },
    { id: "journal", label: "전표 입력", icon: FileText, roles: ["admin", "employee"] },
    { id: "inventory", label: "재고 관리", icon: Package, roles: ["admin", "employee"] },
    { id: "reports", label: "보고서", icon: BarChart3, roles: ["admin", "employee"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">토이 ERP</h1>
            <p className="text-sm text-gray-500">{userRole === "admin" ? "관리자" : "사원"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeMenu === item.id ? "default" : "ghost"}
            className={cn("w-full justify-start gap-3", activeMenu === item.id && "bg-blue-600 text-white")}
            onClick={() => setActiveMenu(item.id)}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="h-5 w-5" />
          로그아웃
        </Button>
      </div>
    </div>
  )
}
