"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, User } from "lucide-react"

export default function LoginPage() {
  const [loginType, setLoginType] = useState("admin")
  const [credentials, setCredentials] = useState({ username: "", password: "" })

  const handleLogin = () => {
    // 실제로는 JWT 토큰 검증 로직이 들어갈 부분
    if (credentials.username && credentials.password) {
      // 로그인 성공 시 대시보드로 이동하는 로직
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">토이 ERP 시스템</CardTitle>
          <CardDescription>통합 업무 관리 시스템에 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={setLoginType} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                관리자
              </TabsTrigger>
              <TabsTrigger value="employee" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                사원
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="admin-username">관리자 ID</Label>
                <Input
                  id="admin-username"
                  placeholder="admin"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">비밀번호</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                관리자 로그인
              </Button>
            </TabsContent>

            <TabsContent value="employee" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="employee-username">사원번호</Label>
                <Input
                  id="employee-username"
                  placeholder="EMP001"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-password">비밀번호</Label>
                <Input
                  id="employee-password"
                  type="password"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                사원 로그인
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>데모 계정</p>
            <p>관리자: admin / admin123</p>
            <p>사원: EMP001 / emp123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
