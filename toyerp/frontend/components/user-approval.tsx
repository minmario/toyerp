"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Eye, Check, X, Clock, Users, UserCheck, UserX } from "lucide-react"

export function UserApproval() {
  const [pendingUsers, setPendingUsers] = useState([
    {
      id: 1,
      username: "kim123",
      name: "김신입",
      email: "kim@company.com",
      phone: "010-1234-5678",
      department: "개발팀",
      position: "사원",
      employeeId: "EMP005",
      appliedDate: "2024-01-20",
      status: "대기중",
    },
    {
      id: 2,
      username: "lee456",
      name: "이지원",
      email: "lee@company.com",
      phone: "010-2345-6789",
      department: "인사팀",
      position: "대리",
      employeeId: "EMP006",
      appliedDate: "2024-01-21",
      status: "대기중",
    },
    {
      id: 3,
      username: "park789",
      name: "박회계",
      email: "park@company.com",
      phone: "010-3456-7890",
      department: "회계팀",
      position: "사원",
      employeeId: "EMP007",
      appliedDate: "2024-01-22",
      status: "대기중",
    },
  ])

  const [approvedUsers, setApprovedUsers] = useState([
    {
      id: 4,
      username: "admin",
      name: "관리자",
      email: "admin@company.com",
      phone: "010-0000-0000",
      department: "총무팀",
      position: "부장",
      employeeId: "ADM001",
      appliedDate: "2024-01-01",
      approvedDate: "2024-01-01",
      status: "승인됨",
      approvedBy: "시스템",
    },
    {
      id: 5,
      username: "EMP001",
      name: "김철수",
      email: "kim.cs@company.com",
      phone: "010-1111-1111",
      department: "개발팀",
      position: "팀장",
      employeeId: "EMP001",
      appliedDate: "2024-01-10",
      approvedDate: "2024-01-10",
      status: "승인됨",
      approvedBy: "관리자",
    },
  ])

  const [rejectedUsers, setRejectedUsers] = useState([
    {
      id: 6,
      username: "test123",
      name: "테스트",
      email: "test@test.com",
      phone: "010-9999-9999",
      department: "기타",
      position: "사원",
      employeeId: "TEST001",
      appliedDate: "2024-01-15",
      rejectedDate: "2024-01-16",
      status: "거절됨",
      rejectedBy: "관리자",
      rejectionReason: "부적절한 신청 정보",
    },
  ])

  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleApprove = (user) => {
    const approvedUser = {
      ...user,
      status: "승인됨",
      approvedDate: new Date().toISOString().split("T")[0],
      approvedBy: "관리자",
    }

    setPendingUsers(pendingUsers.filter((u) => u.id !== user.id))
    setApprovedUsers([approvedUser, ...approvedUsers])
    alert(`${user.name}님의 가입이 승인되었습니다.`)
  }

  const handleReject = (user) => {
    setSelectedUser(user)
    setIsRejectDialogOpen(true)
  }

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      alert("거절 사유를 입력해주세요.")
      return
    }

    const rejectedUser = {
      ...selectedUser,
      status: "거절됨",
      rejectedDate: new Date().toISOString().split("T")[0],
      rejectedBy: "관리자",
      rejectionReason: rejectionReason,
    }

    setPendingUsers(pendingUsers.filter((u) => u.id !== selectedUser.id))
    setRejectedUsers([rejectedUser, ...rejectedUsers])

    setIsRejectDialogOpen(false)
    setRejectionReason("")
    setSelectedUser(null)
    alert(`${rejectedUser.name}님의 가입이 거절되었습니다.`)
  }

  const viewUserDetail = (user) => {
    setSelectedUser(user)
    setIsDetailDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "승인됨":
        return "bg-green-100 text-green-800"
      case "거절됨":
        return "bg-red-100 text-red-800"
      case "대기중":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "승인됨":
        return <UserCheck className="h-4 w-4" />
      case "거절됨":
        return <UserX className="h-4 w-4" />
      case "대기중":
        return <Clock className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const filteredPendingUsers = pendingUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredApprovedUsers = approvedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRejectedUsers = rejectedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사용자 승인 관리</h1>
          <p className="text-gray-600 mt-2">회원가입 신청을 검토하고 승인/거절하세요</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</p>
            <p className="text-sm text-gray-600">승인 대기</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{approvedUsers.length}</p>
            <p className="text-sm text-gray-600">승인 완료</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{rejectedUsers.length}</p>
            <p className="text-sm text-gray-600">거절</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>검색</CardTitle>
          <CardDescription>이름, 사용자ID, 부서, 사번으로 검색하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            승인 대기 ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <UserCheck className="h-4 w-4" />
            승인 완료 ({approvedUsers.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <UserX className="h-4 w-4" />
            거절됨 ({rejectedUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-700">승인 대기 중인 사용자</CardTitle>
              <CardDescription>새로 가입 신청한 사용자들을 검토하고 승인/거절하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사번</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>사용자ID</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>직급</TableHead>
                    <TableHead>신청일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.employeeId}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.appliedDate}</TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => viewUserDetail(user)} title="상세보기">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(user)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="승인"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(user)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="거절"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredPendingUsers.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">승인 대기 중인 사용자가 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">승인된 사용자</CardTitle>
              <CardDescription>승인이 완료되어 시스템을 이용 중인 사용자들입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사번</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>사용자ID</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>직급</TableHead>
                    <TableHead>승인일</TableHead>
                    <TableHead>승인자</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.employeeId}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.approvedDate}</TableCell>
                      <TableCell>{user.approvedBy}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => viewUserDetail(user)} title="상세보기">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">거절된 사용자</CardTitle>
              <CardDescription>가입 신청이 거절된 사용자들입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사번</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>사용자ID</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>거절일</TableHead>
                    <TableHead>거절자</TableHead>
                    <TableHead>거절사유</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRejectedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.employeeId}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.rejectedDate}</TableCell>
                      <TableCell>{user.rejectedBy}</TableCell>
                      <TableCell className="max-w-xs truncate" title={user.rejectionReason}>
                        {user.rejectionReason}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => viewUserDetail(user)} title="상세보기">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 사용자 상세 정보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>사용자 상세 정보</DialogTitle>
            <DialogDescription>사용자의 상세 정보를 확인하세요</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">이름</Label>
                  <p className="text-lg font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">사용자ID</Label>
                  <p className="text-lg font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">사번</Label>
                  <p className="text-lg font-medium">{selectedUser.employeeId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">상태</Label>
                  <Badge className={`gap-1 ${getStatusColor(selectedUser.status)}`}>
                    {getStatusIcon(selectedUser.status)}
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">이메일</Label>
                <p className="text-lg font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">연락처</Label>
                <p className="text-lg font-medium">{selectedUser.phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">부서</Label>
                  <p className="text-lg font-medium">{selectedUser.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">직급</Label>
                  <p className="text-lg font-medium">{selectedUser.position}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">신청일</Label>
                <p className="text-lg font-medium">{selectedUser.appliedDate}</p>
              </div>
              {selectedUser.approvedDate && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">승인일</Label>
                  <p className="text-lg font-medium">{selectedUser.approvedDate}</p>
                </div>
              )}
              {selectedUser.rejectionReason && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">거절 사유</Label>
                  <p className="text-lg font-medium bg-red-50 p-3 rounded-lg">{selectedUser.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 거절 사유 입력 다이얼로그 */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>가입 거절</DialogTitle>
            <DialogDescription>{selectedUser?.name}님의 가입을 거절하는 사유를 입력해주세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">거절 사유</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="거절 사유를 상세히 입력해주세요..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={confirmReject} className="flex-1" variant="destructive">
                거절하기
              </Button>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} className="flex-1 bg-transparent">
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
