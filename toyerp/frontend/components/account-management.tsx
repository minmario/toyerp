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
import { Plus, Search } from "lucide-react"

export function AccountManagement() {
  const [accounts, setAccounts] = useState([
    { code: "1100", name: "현금", type: "자산", description: "현금 및 현금성 자산" },
    { code: "1200", name: "예금", type: "자산", description: "은행 예금" },
    { code: "1300", name: "매출채권", type: "자산", description: "고객으로부터 받을 돈" },
    { code: "1400", name: "재고자산", type: "자산", description: "판매용 상품 재고" },
    { code: "2100", name: "매입채무", type: "부채", description: "공급업체에 지불할 돈" },
    { code: "2200", name: "단기차입금", type: "부채", description: "1년 이내 상환 차입금" },
    { code: "3100", name: "자본금", type: "자본", description: "회사 자본금" },
    { code: "4100", name: "매출", type: "수익", description: "상품 판매 수익" },
    { code: "5100", name: "매출원가", type: "비용", description: "상품 판매 원가" },
    { code: "6100", name: "급여", type: "비용", description: "직원 급여 비용" },
  ])

  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "",
    description: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("전체")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddAccount = () => {
    setAccounts([...accounts, newAccount])
    setNewAccount({ code: "", name: "", type: "", description: "" })
    setIsDialogOpen(false)
  }

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.includes(searchTerm) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "전체" || account.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "자산":
        return "bg-blue-100 text-blue-800"
      case "부채":
        return "bg-red-100 text-red-800"
      case "자본":
        return "bg-green-100 text-green-800"
      case "수익":
        return "bg-purple-100 text-purple-800"
      case "비용":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">계정과목 관리</h1>
          <p className="text-gray-600 mt-2">회계 처리를 위한 계정과목을 관리하세요</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              계정과목 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 계정과목 등록</DialogTitle>
              <DialogDescription>새로운 계정과목을 등록하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">계정코드</Label>
                <Input
                  id="code"
                  value={newAccount.code}
                  onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                  placeholder="1500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">계정명</Label>
                <Input
                  id="name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  placeholder="유형자산"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">계정유형</Label>
                <Select
                  value={newAccount.type}
                  onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="자산">자산</SelectItem>
                    <SelectItem value="부채">부채</SelectItem>
                    <SelectItem value="자본">자본</SelectItem>
                    <SelectItem value="수익">수익</SelectItem>
                    <SelectItem value="비용">비용</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                  placeholder="계정과목에 대한 설명"
                />
              </div>
              <Button onClick={handleAddAccount} className="w-full">
                등록하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>계정과목 목록</CardTitle>
          <CardDescription>등록된 계정과목을 확인하고 관리하세요</CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="계정명, 코드로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체</SelectItem>
                <SelectItem value="자산">자산</SelectItem>
                <SelectItem value="부채">부채</SelectItem>
                <SelectItem value="자본">자본</SelectItem>
                <SelectItem value="수익">수익</SelectItem>
                <SelectItem value="비용">비용</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>계정코드</TableHead>
                <TableHead>계정명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>설명</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.code}>
                  <TableCell className="font-medium">{account.code}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(account.type)}>{account.type}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{account.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
