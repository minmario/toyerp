import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, FileText, Package, TrendingUp, DollarSign } from "lucide-react"

export function DashboardContent() {
  const stats = [
    {
      title: "총 사원 수",
      value: "24명",
      description: "재직 중인 사원",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "계정과목",
      value: "156개",
      description: "등록된 계정과목",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "이번 달 전표",
      value: "89건",
      description: "처리된 전표 수",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "재고 품목",
      value: "342개",
      description: "관리 중인 품목",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "월 매출",
      value: "₩45,230,000",
      description: "이번 달 매출액",
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      title: "성장률",
      value: "+12.5%",
      description: "전월 대비 성장",
      icon: TrendingUp,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">토이 ERP 시스템 현황을 한눈에 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>시스템에서 발생한 최근 활동들</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">새로운 사원이 등록되었습니다</p>
                  <p className="text-xs text-gray-500">김철수 - 개발팀</p>
                </div>
                <span className="text-xs text-gray-400">2분 전</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">전표가 승인되었습니다</p>
                  <p className="text-xs text-gray-500">JE-2024-001</p>
                </div>
                <span className="text-xs text-gray-400">15분 전</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">재고가 입고되었습니다</p>
                  <p className="text-xs text-gray-500">노트북 - 10대</p>
                </div>
                <span className="text-xs text-gray-400">1시간 전</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
            <CardDescription>자주 사용하는 기능들</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <FileText className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-sm">전표 입력</p>
                <p className="text-xs text-gray-500">새 전표 작성</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Package className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-sm">재고 입고</p>
                <p className="text-xs text-gray-500">상품 입고 처리</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-sm">사원 등록</p>
                <p className="text-xs text-gray-500">새 사원 추가</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <BookOpen className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-medium text-sm">계정과목</p>
                <p className="text-xs text-gray-500">계정과목 관리</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
