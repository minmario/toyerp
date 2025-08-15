"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Download, Package, Truck, CheckCircle, Clock } from "lucide-react"

interface OrderManagementProps {
  userInfo: any
}

export function OrderManagement({ userInfo }: OrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("전체")

  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "배송완료",
      totalAmount: 2400000,
      items: [
        { name: "비즈니스 노트북", quantity: 2, price: 1080000, total: 2160000 },
        { name: "무선 마우스", quantity: 10, price: 22500, total: 225000 },
      ],
      shippingAddress: "서울시 강남구 테헤란로 123",
      trackingNumber: "CJ1234567890",
      estimatedDelivery: "2024-01-17",
      actualDelivery: "2024-01-16",
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-18",
      status: "배송중",
      totalAmount: 750000,
      items: [
        { name: "무선 마우스", quantity: 30, price: 22500, total: 675000 },
        { name: "기계식 키보드", quantity: 1, price: 72000, total: 72000 },
      ],
      shippingAddress: "서울시 강남구 테헤란로 123",
      trackingNumber: "CJ1234567891",
      estimatedDelivery: "2024-01-22",
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-20",
      status: "처리중",
      totalAmount: 1200000,
      items: [
        { name: "4K 모니터", quantity: 4, price: 270000, total: 1080000 },
        { name: "기계식 키보드", quantity: 2, price: 72000, total: 144000 },
      ],
      shippingAddress: "서울시 강남구 테헤란로 123",
      estimatedDelivery: "2024-01-25",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "배송완료":
        return <CheckCircle className="h-4 w-4" />
      case "배송중":
        return <Truck className="h-4 w-4" />
      case "처리중":
        return <Clock className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "배송완료":
        return "bg-green-100 text-green-800"
      case "배송중":
        return "bg-blue-100 text-blue-800"
      case "처리중":
        return "bg-yellow-100 text-yellow-800"
      case "취소":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "전체" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">주문 관리</h1>
        <p className="text-gray-600 mt-2">주문 내역을 확인하고 배송 상태를 추적하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주문 검색</CardTitle>
          <CardDescription>주문번호나 상품명으로 검색하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="주문번호, 상품명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체</SelectItem>
                <SelectItem value="처리중">처리중</SelectItem>
                <SelectItem value="배송중">배송중</SelectItem>
                <SelectItem value="배송완료">배송완료</SelectItem>
                <SelectItem value="취소">취소</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {order.id}
                    <Badge className={`gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>주문일: {order.date}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">₩{order.totalAmount.toLocaleString()}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Eye className="h-4 w-4" />
                      상세보기
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Download className="h-4 w-4" />
                      영수증
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="items" className="w-full">
                <TabsList>
                  <TabsTrigger value="items">주문 상품</TabsTrigger>
                  <TabsTrigger value="shipping">배송 정보</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>상품명</TableHead>
                        <TableHead>수량</TableHead>
                        <TableHead>단가</TableHead>
                        <TableHead>합계</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}개</TableCell>
                          <TableCell>₩{item.price.toLocaleString()}</TableCell>
                          <TableCell className="font-medium">₩{item.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="shipping" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">배송 주소</h4>
                      <p className="text-gray-600">{order.shippingAddress}</p>

                      <h4 className="font-medium">예상 배송일</h4>
                      <p className="text-gray-600">{order.estimatedDelivery}</p>

                      {order.actualDelivery && (
                        <>
                          <h4 className="font-medium">실제 배송일</h4>
                          <p className="text-green-600 font-medium">{order.actualDelivery}</p>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      {order.trackingNumber && (
                        <>
                          <h4 className="font-medium">운송장 번호</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600">{order.trackingNumber}</p>
                            <Button variant="outline" size="sm">
                              배송 추적
                            </Button>
                          </div>
                        </>
                      )}

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-2">배송 상태</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">주문 접수</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">상품 준비</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${order.status === "배송중" || order.status === "배송완료" ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span className="text-sm">배송 시작</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${order.status === "배송완료" ? "bg-green-500" : "bg-gray-300"}`}
                            ></div>
                            <span className="text-sm">배송 완료</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">검색 조건에 맞는 주문이 없습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
