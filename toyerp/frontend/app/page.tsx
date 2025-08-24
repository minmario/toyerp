"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    employeeId: "",
  })

  const validateForm = () => {
    const newErrors = { username: "", password: "" }

    if (!credentials.username.trim()) {
      newErrors.username = "아이디를 입력해 주세요."
    }

    if (!credentials.password.trim()) {
      newErrors.password = "비밀번호를 입력하세요."
    }

    setErrors(newErrors)
    return !newErrors.username && !newErrors.password
  }

  const handleLogin = () => {
    if (validateForm()) {
      // 로그인 처리
      window.location.href = "/dashboard"
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  const handleRegister = () => {
    // 유효성 검사
    if (!registerData.username || !registerData.password || !registerData.name) {
      alert("필수 항목을 모두 입력해주세요.")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    if (registerData.password.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.")
      return
    }

    // 회원가입 처리
    alert("회원가입이 완료되었습니다! 관리자 승인 후 이용 가능합니다.")

    // 폼 초기화 및 로그인 화면으로 돌아가기
    setRegisterData({
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      employeeId: "",
    })
    setShowRegister(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {!showRegister && (
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-8 pt-12">
            <CardTitle className="text-2xl font-bold text-gray-900">로그인</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              {/* 아이디 입력 */}
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="아이디를 입력해 주세요."
                    value={credentials.username}
                    onChange={(e) => {
                      setCredentials({ ...credentials, username: e.target.value })
                      if (errors.username) setErrors({ ...errors, username: "" })
                    }}
                    onKeyPress={handleKeyPress}
                    className={`pl-10 h-12 ${
                      errors.username
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {errors.username && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
                {errors.username && <p className="text-sm text-red-500 flex items-center gap-1">{errors.username}</p>}
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요."
                    value={credentials.password}
                    onChange={(e) => {
                      setCredentials({ ...credentials, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                    onKeyPress={handleKeyPress}
                    className={`pl-10 h-12 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-500 flex items-center gap-1">{errors.password}</p>}
              </div>

              {/* 로그인 버튼 */}
              <Button
                onClick={handleLogin}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
              >
                로그인
              </Button>

              {/* 하단 링크들 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                  <label htmlFor="remember" className="text-gray-600 cursor-pointer">
                    아이디 저장
                  </label>
                </div>

                <div className="flex items-center space-x-3 text-gray-500">
                  <button className="hover:text-blue-600 transition-colors">아이디 찾기</button>
                  <span className="text-gray-300">|</span>
                  <button className="hover:text-blue-600 transition-colors">비밀번호 찾기</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => setShowRegister(true)} className="hover:text-blue-600 transition-colors">
                    회원가입
                  </button>
                </div>
              </div>

              {/* 데모 계정 안내 */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500">
                  <p className="mb-3 font-medium">데모 계정</p>
                  <div className="space-y-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <p>
                        <span className="font-medium">관리자:</span> admin / admin123
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p>
                        <span className="font-medium">사원:</span> EMP001 / emp123
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showRegister && (
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900">회원가입</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    placeholder="사용자 ID *"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div>
                  <Input
                    placeholder="사번"
                    value={registerData.employeeId}
                    onChange={(e) => setRegisterData({ ...registerData, employeeId: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>

              <Input
                placeholder="이름 *"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                className="h-10"
              />

              <Input
                type="password"
                placeholder="비밀번호 (6자 이상) *"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="h-10"
              />

              <Input
                type="password"
                placeholder="비밀번호 확인 *"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                className="h-10"
              />

              <Input
                type="email"
                placeholder="이메일"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="h-10"
              />

              <Input
                placeholder="연락처"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                className="h-10"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={registerData.department}
                  onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                  className="h-10 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">부서 선택</option>
                  <option value="개발팀">개발팀</option>
                  <option value="인사팀">인사팀</option>
                  <option value="회계팀">회계팀</option>
                  <option value="영업팀">영업팀</option>
                  <option value="마케팅팀">마케팅팀</option>
                  <option value="총무팀">총무팀</option>
                </select>
                <select
                  value={registerData.position}
                  onChange={(e) => setRegisterData({ ...registerData, position: e.target.value })}
                  className="h-10 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">직급 선택</option>
                  <option value="사원">사원</option>
                  <option value="대리">대리</option>
                  <option value="과장">과장</option>
                  <option value="팀장">팀장</option>
                  <option value="부장">부장</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={handleRegister} className="flex-1 h-10 bg-blue-600 hover:bg-blue-700">
                회원가입
              </Button>
              <Button variant="outline" onClick={() => setShowRegister(false)} className="flex-1 h-10 bg-transparent">
                취소
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              <p>* 필수 입력 항목</p>
              <p>회원가입 후 관리자 승인이 필요합니다</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
