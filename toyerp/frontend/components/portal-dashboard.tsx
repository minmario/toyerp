import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, FileText, Package, TrendingUp, Clock, CheckCircle } from "lucide-react"

interface PortalDashboardProps {
  userInfo: any
}

export function PortalDashboard({ userInfo }: PortalDashboardProps) {
  const stats = [
    {
      title: "이번 달 주문",
      value: "12건",
      description: "총 주문 금액: ₩8,450,000",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "진행 중인 견적",
      value: "3건",
      description: "답변 대기 중",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      title: "자주 주문하는 상품",
      value: "노트북",
      description: "월 평균 5대 주문",
      icon: Package,
      color: "text-green-600",
    },
    {
      title: "절약 금액",
      value: "₩1,200,000",
      description: "VIP 할인 혜택",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const recentOrders = [
    { id: "ORD-2024-001", date: "2024-01-15", status: "배송완료", amount: 2400000, items: "노트북 2대" },
    { id: "ORD-2024-002", date: "2024-01-18", status: "배송중", amount: 750000, items: "마우스 30개" },
    { id: "ORD-2024-003", date: "2024-01-20", status: "처리중", amount: 1200000, items: "모니터 4대" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "배송완료":
        return "bg-green-100 text-green-800"
      case "배송중":
        return "bg-blue-100 text-blue-800"
      case "처리중":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">{userInfo.companyName}의 주문 현황을 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 주문 내역</CardTitle>
            <CardDescription>최근 주문한 상품들을 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{order.id}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.items}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₩{order.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              전체 주문 내역 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 주문</CardTitle>
            <CardDescription>자주 주문하는 상품들</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">노트북</p>
                    <p className="text-xs text-gray-500">VIP 가격: ₩1,080,000</p>
                  </div>
                </div>
                <Button size="sm">주문</Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">마우스</p>
                    <p className="text-xs text-gray-500">VIP 가격: ₩22,500</p>
                  </div>
                </div>
                <Button size="sm">주문</Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">모니터</p>
                    <p className="text-xs text-gray-500">VIP 가격: ₩270,000</p>
                  </div>
                </div>
                <Button size="sm">주문</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>공지사항 및 혜택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-blue-900">VIP 고객 특별 할인 이벤트</p>
                <p className="text-sm text-blue-700">2월 말까지 전 상품 10% 추가 할인</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Clock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-green-900">신제품 출시 안내</p>
                <p className="text-sm text-green-700">최신 노트북 모델이 입고되었습니다</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
