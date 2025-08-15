"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, ShoppingCart, FileText, Building2, LogOut, Star } from "lucide-react"

interface PortalSidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  userInfo: any
}

export function PortalSidebar({ activeMenu, setActiveMenu, userInfo }: PortalSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "대시보드", icon: LayoutDashboard },
    { id: "products", label: "상품 카탈로그", icon: Package },
    { id: "orders", label: "주문 관리", icon: ShoppingCart },
    { id: "quotes", label: "견적 요청", icon: FileText },
    { id: "profile", label: "기업 정보", icon: Building2 },
  ]

  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case "VIP_CUSTOMER":
        return (
          <Badge className="bg-gold-100 text-gold-800 gap-1">
            <Star className="h-3 w-3" />
            VIP
          </Badge>
        )
      case "PARTNER":
        return <Badge className="bg-purple-100 text-purple-800">파트너</Badge>
      default:
        return <Badge variant="secondary">일반</Badge>
    }
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">B2B 포털</h1>
            <p className="text-sm text-gray-500">{userInfo.companyCode}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">{userInfo.companyName}</p>
          <div className="flex items-center gap-2">{getCustomerTypeBadge(userInfo.customerType)}</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
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
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">신용 한도</p>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              ₩{(userInfo.creditLimit - userInfo.usedCredit).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">/ ₩{userInfo.creditLimit.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(userInfo.usedCredit / userInfo.creditLimit) * 100}%` }}
            ></div>
          </div>
        </div>

        <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="h-5 w-5" />
          로그아웃
        </Button>
      </div>
    </div>
  )
}
