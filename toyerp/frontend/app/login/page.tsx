"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, AlertCircle, Mail, Clock, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false)
  const [showIdRecovery, setShowIdRecovery] = useState(false)
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
  })
  const [recoveryData, setRecoveryData] = useState({
  name: "",
  email: "",
  userId: "",
  newPassword: "",
  confirmNewPassword: "",
})

  // API 기본 URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  // 이메일 인증 관련 상태
  const [emailVerification, setEmailVerification] = useState({
    code: "",
    isCodeSent: false,
    isVerified: false,
    timeLeft: 0,
    isLoading: false,
  })

  const [recoveryEmailVerification, setRecoveryEmailVerification] = useState({
    code: "",
    isCodeSent: false,
    isVerified: false,
    timeLeft: 0,
    isLoading: false,
  })

  // 타이머 효과
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (emailVerification.timeLeft > 0) {
      interval = setInterval(() => {
        setEmailVerification((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [emailVerification.timeLeft])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (recoveryEmailVerification.timeLeft > 0) {
      interval = setInterval(() => {
        setRecoveryEmailVerification((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [recoveryEmailVerification.timeLeft])

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

  // 🆕 실제 로그인 API 호출
  const handleLogin = async () => {
    if (!validateForm()) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // 로그인 성공 시 토큰 저장 및 리다이렉트
        if (rememberMe) {
          localStorage.setItem('token', result.token)
          localStorage.setItem('username', credentials.username)
        } else {
          sessionStorage.setItem('token', result.token)
        }
        
        window.location.href = "/console/dashboard"
      } else {
        const errorData = await response.json()
        alert(errorData.message || '로그인에 실패했습니다.')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      alert('서버와의 연결에 문제가 발생했습니다.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  // 🆕 실제 이메일 인증번호 발송 API
  const sendVerificationCode = async (isRegister: boolean) => {
    const data = isRegister ? registerData : recoveryData
    const emailVerificationState = isRegister ? setEmailVerification : setRecoveryEmailVerification

    if (!data.email || !data.email.includes("@")) {
      alert("올바른 이메일 주소를 입력해주세요.")
      return
    }

    emailVerificationState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch(`${API_BASE_URL}/email/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          type: isRegister ? 'register' : 'recovery', // 용도 구분
        }),
      })

      if (response.ok) {
        const message = await response.text()
        
        emailVerificationState({
          code: "",
          isCodeSent: true,
          isVerified: false,
          timeLeft: 180, // 3분
          isLoading: false,
        })

        alert(message)
      } else {
        const errorMessage = await response.text()
        alert(errorMessage || '인증번호 발송에 실패했습니다.')
        emailVerificationState((prev) => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('인증번호 발송 오류:', error)
      alert('서버와의 연결에 문제가 발생했습니다.')
      emailVerificationState((prev) => ({ ...prev, isLoading: false }))
    }
  }

  // 🆕 실제 인증번호 확인 API
  const verifyCode = async (isRegister: boolean) => {
    const code = isRegister ? emailVerification.code : recoveryEmailVerification.code
    const data = isRegister ? registerData : recoveryData
    const emailVerificationState = isRegister ? setEmailVerification : setRecoveryEmailVerification

    if (!code || code.length !== 6) {
      alert("6자리 인증번호를 입력해주세요.")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/email/verify-code-only`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          code: code,
        }),
      })

      if (response.ok) {
        emailVerificationState((prev) => ({
          ...prev,
          isVerified: true,
          timeLeft: 0,
        }))
        
        alert("이메일 인증이 완료되었습니다!")
      } else {
        const errorMessage = await response.text()
        alert(errorMessage || '인증에 실패했습니다.')
      }
    } catch (error) {
      console.error('인증 확인 오류:', error)
      alert('서버와의 연결에 문제가 발생했습니다.')
    }
  }

  // 🆕 실제 회원가입 API
  const handleRegister = async () => {
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

    if (registerData.email && !emailVerification.isVerified) {
      alert("이메일 인증을 완료해주세요.")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          name: registerData.name,
          email: registerData.email || null,
          phone: registerData.phone || null,
          emailVerified: emailVerification.isVerified ? 1 : 0,
        }),
      })

      if (response.ok) {
        const message = await response.text()
        alert(message)
        
        // 폼 초기화 및 로그인 화면으로 돌아가기
        setRegisterData({
          username: "",
          password: "",
          confirmPassword: "",
          name: "",
          email: "",
          phone: "",
        })
        setEmailVerification({
          code: "",
          isCodeSent: false,
          isVerified: false,
          timeLeft: 0,
          isLoading: false,
        })
        setShowRegister(false)
      } else {
        const errorMessage = await response.text()
        alert(errorMessage || '회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error('회원가입 오류:', error)
      alert('서버와의 연결에 문제가 발생했습니다.')
    }
  }

  // 🆕 아이디 찾기 API - 이메일로만 찾기
  const handleIdRecovery = async () => {
    if (!recoveryData.email) {
      alert("이메일을 입력해주세요.")
      return
    }

    if (!recoveryEmailVerification.isVerified) {
      alert("이메일 인증을 완료해주세요.")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/find-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: recoveryData.email,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`회원님의 아이디는 '${result.username}' 입니다!`)
        setShowIdRecovery(false)
      } else {
        const errorMessage = await response.text()
        alert(errorMessage || '아이디를 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('아이디 찾기 오류:', error)
      alert('서버와의 연결에 문제가 발생했습니다.')
    }
  }

  // 🆕 비밀번호 찾기 API
  const handlePasswordRecovery = async () => {
    if (!recoveryData.userId || !recoveryData.email) {
      alert("아이디와 이메일을 모두 입력해주세요.")
      return
    }

    if (!recoveryEmailVerification.isVerified) {
      alert("이메일 인증을 완료해주세요.")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: recoveryData.userId,
          email: recoveryData.email,
        }),
      })

      if (response.ok) {
        alert("임시 비밀번호가 이메일로 발송되었습니다!")
        setShowPasswordRecovery(false)
      } else {
        const errorMessage = await response.text()
        alert(errorMessage || '비밀번호 재설정에 실패했습니다.')
      }
    } catch (error) {
      console.error('비밀번호 찾기 오류:', error)
      alert('서버와의 연결에 문제가 발생했습니다.')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {!showRegister && !showPasswordRecovery && !showIdRecovery && !showPasswordReset && (
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
                  <button onClick={() => setShowIdRecovery(true)} className="hover:text-blue-600 transition-colors">
                    아이디 찾기
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => setShowPasswordRecovery(true)}
                    className="hover:text-blue-600 transition-colors"
                  >
                    비밀번호 찾기
                  </button>
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
              <Input
                placeholder="사용자 ID *"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                className="h-10"
              />

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

              {/* 이메일 인증 섹션 */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="이메일 (선택)"
                      value={registerData.email}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, email: e.target.value })
                        // 이메일이 변경되면 인증 상태 초기화
                        if (emailVerification.isCodeSent) {
                          setEmailVerification({
                            code: "",
                            isCodeSent: false,
                            isVerified: false,
                            timeLeft: 0,
                            isLoading: false,
                          })
                        }
                      }}
                      className="h-10 pl-10"
                      disabled={emailVerification.isVerified}
                    />
                    {emailVerification.isVerified && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={() => sendVerificationCode(true)}
                    disabled={
                      !registerData.email ||
                      emailVerification.isLoading ||
                      emailVerification.isVerified ||
                      emailVerification.timeLeft > 0
                    }
                    className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm whitespace-nowrap"
                  >
                    {emailVerification.isLoading
                      ? "발송중..."
                      : emailVerification.timeLeft > 0
                        ? "재발송"
                        : emailVerification.isVerified
                          ? "인증완료"
                          : "인증발송"}
                  </Button>
                </div>

                {/* 인증번호 입력 */}
                {emailVerification.isCodeSent && !emailVerification.isVerified && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="인증번호 6자리"
                          value={emailVerification.code}
                          onChange={(e) =>
                            setEmailVerification((prev) => ({ ...prev, code: e.target.value.replace(/\D/g, "") }))
                          }
                          maxLength={6}
                          className="h-10"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => verifyCode(true)}
                        disabled={emailVerification.code.length !== 6}
                        className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white text-sm"
                      >
                        확인
                      </Button>
                    </div>
                    {emailVerification.timeLeft > 0 && (
                      <div className="flex items-center gap-1 text-sm text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span>남은 시간: {formatTime(emailVerification.timeLeft)}</span>
                      </div>
                    )}
                    {emailVerification.timeLeft === 0 && (
                      <p className="text-sm text-red-500">인증번호가 만료되었습니다. 재발송해주세요.</p>
                    )}
                  </div>
                )}

                {emailVerification.isVerified && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                    <CheckCircle className="h-4 w-4" />
                    <span>이메일 인증이 완료되었습니다!</span>
                  </div>
                )}
              </div>

              <Input
                placeholder="연락처"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleRegister}
                disabled={registerData.email && !emailVerification.isVerified}
                className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
              >
                회원가입
              </Button>
              <Button variant="outline" onClick={() => setShowRegister(false)} className="flex-1 h-10 bg-transparent">
                취소
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500 mt-4">
              <p>* 필수 입력 항목</p>
              <p>이메일 입력 시 인증이 필요합니다</p>
              <p>회원가입 후 관리자 승인이 필요합니다</p>
            </div>
          </CardContent>
        </Card>
      )}

      {showPasswordRecovery && (
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900">비밀번호 찾기</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <button className="pb-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
                  이메일로 찾기
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="아이디를 입력하세요."
                value={recoveryData.userId}
                onChange={(e) => setRecoveryData({ ...recoveryData, userId: e.target.value })}
                className="h-12"
              />

              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="이메일을 입력하세요."
                  value={recoveryData.email}
                  onChange={(e) => setRecoveryData({ ...recoveryData, email: e.target.value })}
                  className="h-12 flex-1"
                />
                <Button
                  onClick={() => sendVerificationCode(false)}
                  disabled={
                    !recoveryData.email ||
                    recoveryEmailVerification.isLoading ||
                    recoveryEmailVerification.timeLeft > 0
                  }
                  className="h-12 px-4 bg-gray-500 hover:bg-gray-600 text-white whitespace-nowrap"
                >
                  {recoveryEmailVerification.isLoading ? "발송중..." : "인증번호 발송"}
                </Button>
              </div>

              {recoveryEmailVerification.isCodeSent && (
                <div className="flex gap-2">
                  <Input
                    placeholder="인증번호를 입력하세요."
                    value={recoveryEmailVerification.code}
                    onChange={(e) => setRecoveryEmailVerification((prev) => ({ 
                      ...prev, 
                      code: e.target.value.replace(/\D/g, "") 
                    }))}
                    maxLength={6}
                    className="h-12 flex-1"
                  />
                  <Button
                    onClick={() => verifyCode(false)}
                    disabled={recoveryEmailVerification.code.length !== 6}
                    className="h-12 px-4 bg-green-600 hover:bg-green-700 text-white"
                  >
                    확인
                  </Button>
                </div>
              )}

              {recoveryEmailVerification.timeLeft > 0 && (
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span>남은 시간: {formatTime(recoveryEmailVerification.timeLeft)}</span>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={() => setShowPasswordRecovery(false)}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  취소
                </Button>
                <Button
                  onClick={() => {
                    if (!recoveryEmailVerification.isVerified) {
                      alert("이메일 인증을 완료해주세요.")
                      return
                    }
                    // 비밀번호 재설정 화면으로 이동
                    setShowPasswordRecovery(false)
                    setShowPasswordReset(true)
                  }}
                  className="flex-1 h-12 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300"
                >
                  확인
                </Button>
              </div>

              <div className="flex justify-center gap-3 text-sm text-gray-500 mt-4">
                <button
                  onClick={() => {
                    setShowPasswordRecovery(false)
                    setShowIdRecovery(true)
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  아이디 찾기
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    setShowPasswordRecovery(false)
                    setShowRegister(true)
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  회원가입
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showIdRecovery && (
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900">아이디 찾기</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <button className="pb-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
                  이메일로 찾기
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="이메일을 입력하세요."
                  value={recoveryData.email}
                  onChange={(e) => setRecoveryData({ ...recoveryData, email: e.target.value })}
                  className="h-12 flex-1"
                />
                <Button
                  onClick={() => sendVerificationCode(false)}
                  disabled={
                    !recoveryData.email ||
                    recoveryEmailVerification.isLoading ||
                    recoveryEmailVerification.timeLeft > 0
                  }
                  className="h-12 px-4 bg-gray-500 hover:bg-gray-600 text-white whitespace-nowrap"
                >
                  {recoveryEmailVerification.isLoading ? "발송중..." : "인증번호 발송"}
                </Button>
              </div>

              {recoveryEmailVerification.isCodeSent && (
                <div className="flex gap-2">
                  <Input
                    placeholder="인증번호를 입력하세요."
                    value={recoveryEmailVerification.code}
                    onChange={(e) => setRecoveryEmailVerification((prev) => ({ 
                      ...prev, 
                      code: e.target.value.replace(/\D/g, "") 
                    }))}
                    maxLength={6}
                    className="h-12 flex-1"
                  />
                  <Button
                    onClick={() => verifyCode(false)}
                    disabled={recoveryEmailVerification.code.length !== 6}
                    className="h-12 px-4 bg-green-600 hover:bg-green-700 text-white"
                  >
                    확인
                  </Button>
                </div>
              )}

              {recoveryEmailVerification.timeLeft > 0 && (
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span>남은 시간: {formatTime(recoveryEmailVerification.timeLeft)}</span>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={() => setShowIdRecovery(false)} 
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  취소
                </Button>
                <Button
                  onClick={handleIdRecovery}
                  disabled={!recoveryEmailVerification.isVerified}
                  className="flex-1 h-12 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300"
                >
                  확인
                </Button>
              </div>

              <div className="flex justify-center gap-3 text-sm text-gray-500 mt-4">
                <button
                  onClick={() => {
                    setShowIdRecovery(false)
                    setShowPasswordRecovery(true)
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  비밀번호 찾기
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    setShowIdRecovery(false)
                    setShowRegister(true)
                  }}
                  className="hover:text-blue-600 transition-colors"
                >
                  회원가입
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {showPasswordReset && (
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900">새 비밀번호 설정</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="새 비밀번호 (6자 이상)"
                value={recoveryData.newPassword || ""}
                onChange={(e) => setRecoveryData({ ...recoveryData, newPassword: e.target.value })}
                className="h-12"
              />
              <Input
                type="password"
                placeholder="새 비밀번호 확인"
                value={recoveryData.confirmNewPassword || ""}
                onChange={(e) => setRecoveryData({ ...recoveryData, confirmNewPassword: e.target.value })}
                className="h-12"
              />
              <div className="flex gap-2 mt-6">
                <Button
                  onClick={() => {
                    setShowPasswordReset(false)
                    setRecoveryData({ name: "", email: "", userId: "", newPassword: "", confirmNewPassword: "" })
                    setRecoveryEmailVerification({
                      code: "",
                      isCodeSent: false,
                      isVerified: false,
                      timeLeft: 0,
                      isLoading: false,
                    })
                  }}
                  variant="outline"
                  className="flex-1 h-12 bg-transparent"
                >
                  취소
                </Button>
                <Button
                  onClick={() => {
                    if (!recoveryData.newPassword || recoveryData.newPassword.length < 6) {
                      alert("비밀번호는 6자 이상이어야 합니다.")
                      return
                    }
                    if (recoveryData.newPassword !== recoveryData.confirmNewPassword) {
                      alert("비밀번호가 일치하지 않습니다.")
                      return
                    }
                    // TODO: 서버에 비밀번호 변경 API 요청
                    alert("비밀번호가 성공적으로 변경되었습니다!")
                    setShowPasswordReset(false)
                  }}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  변경하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}