import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  userRole: string
}

export function Header({ userRole }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">ERP 관리 시스템</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="검색..."
              className="pl-10 w-64 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            />
          </div>

          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-gray-50">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>

          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-gray-50">
            <User className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}
