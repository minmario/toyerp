"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, User, CreditCard, Star, Edit, Save } from "lucide-react"

interface CompanyProfileProps {
  userInfo: any
}

export function CompanyProfile({ userInfo }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    companyName: userInfo.companyName,
    businessNumber: "123-45-67890",
    address: "서울시 강남구 테헤란로 123, 10층",
    phone: "02-1234-5678",
    email: "contact@techsolution.com",
    contactPerson: userInfo.contactPerson,
    contactPhone: "010-1234-5678",
    contactEmail: "kim@techsolution.com",
  })

  const handleSave = () => {
    setIsEditing(false)
    alert("회사 정보가 업데이트되었습니다.")
  }

  const creditHistory = [
    { date: "2024-01-15", type: "주문", amount: -2400000, balance: 47600000, description: "ORD-2024-001" },
    { date: "2024-01-10", type: "입금", amount: 5000000, balance: 50000000, description: "신용한도 증액" },
    { date: "2024-01-05", type: "주문", amount: -1200000, balance: 45000000, description: "ORD-2023-089" },
  ]

  const orderStats = {
    totalOrders: 156,
    totalAmount: 245000000,
    averageOrderValue: 1570000,
    lastOrderDate: "2024-01-20",
    favoriteCategory: "전자제품",
    loyaltyPoints: 24500,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">기업 정보</h1>
          <p className="text-gray-600 mt-2">회사 정보와 거래 현황을 확인하고 관리하세요</p>
        </div>
        <Button onClick={isEditing ? handleSave : () => setIsEditing(true)} className="gap-2">
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? "저장" : "수정"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              회사 기본 정보
            </CardTitle>
            <CardDescription>회사의 기본 정보를 확인하고 수정할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">회사명</Label>
                <Input
                  id="company-name"
                  value={profileData.companyName}
                  onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-number">사업자등록번호</Label>
                <Input
                  id="business-number"
                  value={profileData.businessNumber}
                  onChange={(e) => setProfileData({ ...profileData, businessNumber: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">대표전화</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">대표이메일</Label>
                <Input
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              담당자 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-person">담당자명</Label>
              <Input
                id="contact-person"
                value={profileData.contactPerson}
                onChange={(e) => setProfileData({ ...profileData, contactPerson: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">연락처</Label>
              <Input
                id="contact-phone"
                value={profileData.contactPhone}
                onChange={(e) => setProfileData({ ...profileData, contactPhone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">이메일</Label>
              <Input
                id="contact-email"
                value={profileData.contactEmail}
                onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="credit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="credit">신용 관리</TabsTrigger>
          <TabsTrigger value="stats">거래 통계</TabsTrigger>
          <TabsTrigger value="benefits">혜택 정보</TabsTrigger>
        </TabsList>

        <TabsContent value="credit">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  신용 한도 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium">총 신용한도</span>
                    <span className="text-xl font-bold text-blue-600">₩{userInfo.creditLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium">사용 금액</span>
                    <span className="text-xl font-bold text-red-600">₩{userInfo.usedCredit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">사용 가능 금액</span>
                    <span className="text-xl font-bold text-green-600">
                      ₩{(userInfo.creditLimit - userInfo.usedCredit).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${(userInfo.usedCredit / userInfo.creditLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    신용한도 사용률: {Math.round((userInfo.usedCredit / userInfo.creditLimit) * 100)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>신용 거래 내역</CardTitle>
                <CardDescription>최근 신용 거래 내역을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creditHistory.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {transaction.amount > 0 ? "+" : ""}₩{Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">잔액: ₩{transaction.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>총 주문 건수</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{orderStats.totalOrders}건</p>
                <p className="text-sm text-gray-500 mt-1">누적 주문 건수</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>총 주문 금액</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">₩{orderStats.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">누적 주문 금액</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>평균 주문 금액</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">₩{orderStats.averageOrderValue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">건당 평균 금액</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>최근 주문일</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{orderStats.lastOrderDate}</p>
                <p className="text-sm text-gray-500 mt-1">마지막 주문 날짜</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>선호 카테고리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">{orderStats.favoriteCategory}</p>
                <p className="text-sm text-gray-500 mt-1">가장 많이 주문한 분야</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>적립 포인트</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.loyaltyPoints.toLocaleString()}P</p>
                <p className="text-sm text-gray-500 mt-1">사용 가능 포인트</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  VIP 고객 혜택
                </CardTitle>
                <CardDescription>현재 고객 등급에 따른 혜택을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">기본 할인율</span>
                    <Badge className="bg-yellow-100 text-yellow-800">10%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">무료 배송</span>
                    <Badge className="bg-blue-100 text-blue-800">항상</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">우선 배송</span>
                    <Badge className="bg-green-100 text-green-800">1-2일</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">전담 상담사</span>
                    <Badge className="bg-purple-100 text-purple-800">지원</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>등급 업그레이드 조건</CardTitle>
                <CardDescription>다음 등급까지의 조건을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">연간 주문 금액</span>
                      <span className="text-sm text-gray-600">₩245M / ₩300M</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">주문 건수</span>
                      <span className="text-sm text-gray-600">156건 / 200건</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>파트너 등급</strong>까지 연간 ₩55M, 44건 더 주문하시면 됩니다.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">파트너 등급 시 추가 5% 할인 혜택이 제공됩니다.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
