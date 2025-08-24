"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, FileText, Package, DollarSign, AlertTriangle } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"

export function DashboardContent() {
  const stats = [
    {
      title: "총 사원 수",
      value: "24명",
      description: "재직 중인 사원",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2",
      changeType: "increase",
    },
    {
      title: "계정과목",
      value: "156개",
      description: "등록된 계정과목",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+5",
      changeType: "increase",
    },
    {
      title: "이번 달 전표",
      value: "89건",
      description: "처리된 전표 수",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+12",
      changeType: "increase",
    },
    {
      title: "재고 품목",
      value: "342개",
      description: "관리 중인 품목",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "-3",
      changeType: "decrease",
    },
    {
      title: "월 매출",
      value: "₩45,230,000",
      description: "이번 달 매출액",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+12.5%",
      changeType: "increase",
    },
    {
      title: "재고 부족",
      value: "8개",
      description: "최소재고 미달",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "+2",
      changeType: "warning",
    },
  ]

  // 부서별 사원 수 데이터
  const departmentData = [
    { name: "개발팀", value: 8, color: "#3B82F6" },
    { name: "인사팀", value: 4, color: "#10B981" },
    { name: "회계팀", value: 5, color: "#F59E0B" },
    { name: "영업팀", value: 4, color: "#EF4444" },
    { name: "마케팅팀", value: 3, color: "#8B5CF6" },
  ]

  // 재고 상태별 데이터
  const inventoryStatusData = [
    { name: "정상", value: 320, color: "#10B981" },
    { name: "부족", value: 14, color: "#F59E0B" },
    { name: "품절", value: 8, color: "#EF4444" },
  ]

  // 월별 전표 건수 데이터
  const monthlyJournalData = [
    { month: "8월", count: 65 },
    { month: "9월", count: 72 },
    { month: "10월", count: 58 },
    { month: "11월", count: 81 },
    { month: "12월", count: 76 },
    { month: "1월", count: 89 },
  ]

  // 월별 매출 추이 데이터
  const monthlySalesData = [
    { month: "8월", sales: 38500000 },
    { month: "9월", sales: 42300000 },
    { month: "10월", sales: 35800000 },
    { month: "11월", sales: 48200000 },
    { month: "12월", sales: 52100000 },
    { month: "1월", sales: 45230000 },
  ]

  // 직급별 사원 분포
  const positionData = [
    { position: "사원", count: 12 },
    { position: "대리", count: 6 },
    { position: "과장", count: 3 },
    { position: "팀장", count: 2 },
    { position: "부장", count: 1 },
  ]

  // 부서별 활동 랭킹
  const departmentRanking = [
    { rank: 1, department: "개발팀", activity: 156, color: "#3B82F6" },
    { rank: 2, department: "회계팀", activity: 142, color: "#F59E0B" },
    { rank: 3, department: "영업팀", activity: 128, color: "#EF4444" },
    { rank: 4, department: "인사팀", activity: 95, color: "#10B981" },
    { rank: 5, department: "마케팅팀", activity: 87, color: "#8B5CF6" },
  ]

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">토이 ERP 시스템 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{stat.description}</p>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.changeType === "increase"
                      ? "text-green-700 bg-green-100"
                      : stat.changeType === "decrease"
                        ? "text-red-700 bg-red-100"
                        : "text-orange-700 bg-orange-100"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 부서별 사원 분포 */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">부서별 사원 분포</CardTitle>
            <CardDescription>각 부서의 인원 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 재고 상태 현황 */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">재고 상태 현황</CardTitle>
            <CardDescription>총 342개 품목의 상태별 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {inventoryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 월별 추이 차트들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 월별 전표 건수 */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">월별 전표 처리 현황</CardTitle>
            <CardDescription>최근 6개월 전표 처리 건수</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyJournalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 월별 매출 추이 */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">월별 매출 추이</CardTitle>
            <CardDescription>최근 6개월 매출 변화</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₩${(value / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value) => [`₩${value.toLocaleString()}`, "매출액"]} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 하단 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 직급별 사원 분포 */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">직급별 사원 분포</CardTitle>
            <CardDescription>조직 구조 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="position" type="category" width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 부서별 활동 랭킹 */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">부서별 활동 랭킹</CardTitle>
            <CardDescription>이번 달 부서별 업무 처리 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentRanking.map((dept) => (
                <div
                  key={dept.rank}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                      style={{ backgroundColor: dept.color }}
                    >
                      {dept.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{dept.department}</p>
                      <p className="text-sm text-gray-500">처리 건수</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{dept.activity}</p>
                    <p className="text-sm text-gray-500">건</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 작업 섹션 */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">빠른 작업</CardTitle>
          <CardDescription>자주 사용하는 기능들</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-6 border border-gray-100 rounded-xl hover:bg-gray-50 text-left transition-all duration-200 hover:shadow-lg">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-semibold text-sm text-gray-900">전표 입력</p>
              <p className="text-xs text-gray-500 mt-1">새 전표 작성</p>
            </button>
            <button className="p-6 border border-gray-100 rounded-xl hover:bg-gray-50 text-left transition-all duration-200 hover:shadow-lg">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-semibold text-sm text-gray-900">재고 입고</p>
              <p className="text-xs text-gray-500 mt-1">상품 입고 처리</p>
            </button>
            <button className="p-6 border border-gray-100 rounded-xl hover:bg-gray-50 text-left transition-all duration-200 hover:shadow-lg">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <p className="font-semibold text-sm text-gray-900">사원 등록</p>
              <p className="text-xs text-gray-500 mt-1">새 사원 추가</p>
            </button>
            <button className="p-6 border border-gray-100 rounded-xl hover:bg-gray-50 text-left transition-all duration-200 hover:shadow-lg">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <p className="font-semibold text-sm text-gray-900">계정과목</p>
              <p className="text-xs text-gray-500 mt-1">계정과목 관리</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
