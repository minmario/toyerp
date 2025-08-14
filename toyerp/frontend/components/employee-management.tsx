"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Search } from "lucide-react"

export function EmployeeManagement() {
  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "김철수",
      department: "개발팀",
      position: "팀장",
      email: "kim@company.com",
      phone: "010-1234-5678",
      status: "재직",
      joinDate: "2023-01-15",
    },
    {
      id: "EMP002",
      name: "이영희",
      department: "인사팀",
      position: "대리",
      email: "lee@company.com",
      phone: "010-2345-6789",
      status: "재직",
      joinDate: "2023-03-20",
    },
    {
      id: "EMP003",
      name: "박민수",
      department: "회계팀",
      position: "사원",
      email: "park@company.com",
      phone: "010-3456-7890",
      status: "퇴사",
      joinDate: "2022-11-10",
    },
  ])

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    status: "재직",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddEmployee = () => {
    const empId = `EMP${String(employees.length + 1).padStart(3, "0")}`
    const employee = {
      ...newEmployee,
      id: empId,
      joinDate: new Date().toISOString().split("T")[0],
    }
    setEmployees([...employees, employee])
    setNewEmployee({
      name: "",
      department: "",
      position: "",
      email: "",
      phone: "",
      status: "재직",
    })
    setIsDialogOpen(false)
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사원 관리</h1>
          <p className="text-gray-600 mt-2">사원 정보를 등록하고 관리하세요</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              사원 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 사원 등록</DialogTitle>
              <DialogDescription>새로운 사원의 정보를 입력하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  placeholder="홍길동"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">부서</Label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="부서 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="개발팀">개발팀</SelectItem>
                    <SelectItem value="인사팀">인사팀</SelectItem>
                    <SelectItem value="회계팀">회계팀</SelectItem>
                    <SelectItem value="영업팀">영업팀</SelectItem>
                    <SelectItem value="마케팅팀">마케팅팀</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">직급</Label>
                <Select
                  value={newEmployee.position}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, position: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="직급 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사원">사원</SelectItem>
                    <SelectItem value="대리">대리</SelectItem>
                    <SelectItem value="과장">과장</SelectItem>
                    <SelectItem value="팀장">팀장</SelectItem>
                    <SelectItem value="부장">부장</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="hong@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="010-1234-5678"
                />
              </div>
              <Button onClick={handleAddEmployee} className="w-full">
                등록하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사원 목록</CardTitle>
          <CardDescription>등록된 사원들의 정보를 확인하고 관리하세요</CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="사원명, 부서, 사번으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사번</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>입사일</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "재직" ? "default" : "secondary"}>{employee.status}</Badge>
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
