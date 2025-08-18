"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Package,
  BarChart3,
  LogOut,
  Building2,
  UserCheck,
} from "lucide-react"

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  userRole: string
}

export function Sidebar({ activeMenu, setActiveMenu, userRole }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "대시보드", icon: LayoutDashboard, roles: ["admin", "employee"] },
    { id: "employees", label: "사원 관리", icon: Users, roles: ["admin"] },
    { id: "user-approval", label: "사용자 승인", icon: UserCheck, roles: ["admin"] },
    { id: "accounts", label: "계정과목", icon: BookOpen, roles: ["admin", "employee"] },
    { id: "journal", label: "전표 입력", icon: FileText, roles: ["admin", "employee"] },
    { id: "inventory", label: "재고 관리", icon: Package, roles: ["admin", "employee"] },
    { id: "reports", label: "보고서", icon: BarChart3, roles: ["admin", "employee"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  const handleLogout = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      localStorage.removeItem("userToken")
      sessionStorage.clear()
      window.location.href = "/"
    }
  }

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">토이 ERP</h1>
            <p className="text-sm text-slate-300">{userRole === "admin" ? "관리자" : "사원"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200 font-medium",
              activeMenu === item.id
                ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                : "text-slate-300 hover:bg-slate-700 hover:text-white",
            )}
            onClick={() => setActiveMenu(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 font-medium"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>로그아웃</span>
        </Button>
      </div>
    </div>
  )
}
