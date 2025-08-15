"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2 } from "lucide-react"

export default function PortalLoginPage() {
  const [loginType, setLoginType] = useState("login")
  const [credentials, setCredentials] = useState({
    companyCode: "",
    username: "",
    password: "",
  })
  const [registerData, setRegisterData] = useState({
    companyName: "",
    businessNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
  })

  const handleLogin = () => {
    if (credentials.companyCode && credentials.username && credentials.password) {
      window.location.href = "/portal/dashboard"
    }
  }

  const handleRegister = () => {
    alert("회원가입 신청이 완료되었습니다. 승인 후 이용 가능합니다.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">B2B 주문 포털</CardTitle>
          <CardDescription>기업 고객 전용 주문 시스템</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={setLoginType} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="register">회원가입</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="company-code">기업코드</Label>
                <Input
                  id="company-code"
                  placeholder="COMP001"
                  value={credentials.companyCode}
                  onChange={(e) => setCredentials({ ...credentials, companyCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">사용자ID</Label>
                <Input
                  id="username"
                  placeholder="담당자 ID"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                로그인
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">회사명</Label>
                  <Input
                    id="company-name"
                    placeholder="(주)테크컴퍼니"
                    value={registerData.companyName}
                    onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-number">사업자등록번호</Label>
                  <Input
                    id="business-number"
                    placeholder="123-45-67890"
                    value={registerData.businessNumber}
                    onChange={(e) => setRegisterData({ ...registerData, businessNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-person">담당자명</Label>
                  <Input
                    id="contact-person"
                    placeholder="홍길동"
                    value={registerData.contactPerson}
                    onChange={(e) => setRegisterData({ ...registerData, contactPerson: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    placeholder="02-1234-5678"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  />
                </div>
                <Button onClick={handleRegister} className="w-full">
                  회원가입 신청
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>데모 계정</p>
            <p>기업코드: COMP001 / ID: buyer01 / PW: demo123</p>
            <p>VIP: COMP002 / ID: vip01 / PW: demo123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
