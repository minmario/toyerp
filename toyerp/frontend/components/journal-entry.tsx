"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, Search, Eye, Edit, FileText } from "lucide-react"

export function JournalEntry() {
  // 저장된 전표 목록
  const [savedJournals, setSavedJournals] = useState([
    {
      id: "JE-2024-001",
      date: "2024-01-15",
      description: "매출 입금",
      reference: "JE-2024-001",
      status: "승인됨",
      entries: [
        { id: 1, account: "1100", accountName: "현금", debit: 1000000, credit: 0, description: "매출 입금" },
        { id: 2, account: "4100", accountName: "매출", debit: 0, credit: 1000000, description: "상품 판매" },
      ],
      totalDebit: 1000000,
      totalCredit: 1000000,
      createdBy: "김회계",
      createdAt: "2024-01-15 09:30",
    },
    {
      id: "JE-2024-002",
      date: "2024-01-16",
      description: "급여 지급",
      reference: "JE-2024-002",
      status: "승인됨",
      entries: [
        { id: 1, account: "6100", accountName: "급여", debit: 2000000, credit: 0, description: "1월 급여" },
        { id: 2, account: "1100", accountName: "현금", debit: 0, credit: 2000000, description: "급여 지급" },
      ],
      totalDebit: 2000000,
      totalCredit: 2000000,
      createdBy: "이회계",
      createdAt: "2024-01-16 14:20",
    },
    {
      id: "JE-2024-003",
      date: "2024-01-17",
      description: "사무용품 구매",
      reference: "JE-2024-003",
      status: "임시저장",
      entries: [
        { id: 1, account: "6200", accountName: "사무용품비", debit: 150000, credit: 0, description: "프린터 구매" },
        { id: 2, account: "1100", accountName: "현금", debit: 0, credit: 150000, description: "사무용품 구매" },
      ],
      totalDebit: 150000,
      totalCredit: 150000,
      createdBy: "김회계",
      createdAt: "2024-01-17 11:45",
    },
  ])

  // 현재 작성 중인 전표
  const [journalEntries, setJournalEntries] = useState([
    { id: 1, account: "", accountName: "", debit: 0, credit: 0, description: "" },
    { id: 2, account: "", accountName: "", debit: 0, credit: 0, description: "" },
  ])

  const [entryData, setEntryData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    reference: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("전체")
  const [selectedJournal, setSelectedJournal] = useState(null)
  const [activeTab, setActiveTab] = useState("list")

  const accounts = [
    { code: "1100", name: "현금" },
    { code: "1200", name: "예금" },
    { code: "1300", name: "매출채권" },
    { code: "1400", name: "재고자산" },
    { code: "2100", name: "매입채무" },
    { code: "2200", name: "단기차입금" },
    { code: "3100", name: "자본금" },
    { code: "4100", name: "매출" },
    { code: "5100", name: "매출원가" },
    { code: "6100", name: "급여" },
    { code: "6200", name: "사무용품비" },
  ]

  const addJournalLine = () => {
    const newId = Math.max(...journalEntries.map((e) => e.id)) + 1
    setJournalEntries([
      ...journalEntries,
      {
        id: newId,
        account: "",
        accountName: "",
        debit: 0,
        credit: 0,
        description: "",
      },
    ])
  }

  const removeJournalLine = (id: number) => {
    setJournalEntries(journalEntries.filter((entry) => entry.id !== id))
  }

  const updateJournalLine = (id: number, field: string, value: any) => {
    setJournalEntries(
      journalEntries.map((entry) => {
        if (entry.id === id) {
          const updated = { ...entry, [field]: value }
          if (field === "account") {
            const account = accounts.find((acc) => acc.code === value)
            updated.accountName = account ? account.name : ""
          }
          return updated
        }
        return entry
      }),
    )
  }

  const getTotalDebit = () => journalEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0)
  const getTotalCredit = () => journalEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0)
  const isBalanced = () => getTotalDebit() === getTotalCredit() && getTotalDebit() > 0

  const saveJournalEntry = (isDraft = false) => {
    if (!isBalanced() && !isDraft) {
      alert("차변과 대변의 합계가 일치하지 않습니다.")
      return
    }

    const journalId = `JE-2024-${String(savedJournals.length + 1).padStart(3, "0")}`
    const newJournal = {
      id: journalId,
      date: entryData.date,
      description: entryData.description,
      reference: entryData.reference || journalId,
      status: isDraft ? "임시저장" : "승인됨",
      entries: journalEntries.filter((entry) => entry.account && (entry.debit > 0 || entry.credit > 0)),
      totalDebit: getTotalDebit(),
      totalCredit: getTotalCredit(),
      createdBy: "현재사용자",
      createdAt: new Date().toLocaleString(),
    }

    setSavedJournals([newJournal, ...savedJournals])

    // 폼 초기화
    setJournalEntries([
      { id: 1, account: "", accountName: "", debit: 0, credit: 0, description: "" },
      { id: 2, account: "", accountName: "", debit: 0, credit: 0, description: "" },
    ])
    setEntryData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      reference: "",
    })

    alert(isDraft ? "전표가 임시저장되었습니다." : "전표가 저장되었습니다.")
    setActiveTab("list")
  }

  const viewJournal = (journal) => {
    setSelectedJournal(journal)
    setActiveTab("view")
  }

  const editJournal = (journal) => {
    setEntryData({
      date: journal.date,
      description: journal.description,
      reference: journal.reference,
    })
    setJournalEntries(journal.entries)
    setActiveTab("create")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "승인됨":
        return "bg-green-100 text-green-800"
      case "임시저장":
        return "bg-yellow-100 text-yellow-800"
      case "반려":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredJournals = savedJournals.filter((journal) => {
    const matchesSearch =
      journal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.entries.some((entry) => entry.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "전체" || journal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">전표 관리</h1>
          <p className="text-gray-600 mt-2">회계 전표를 입력하고 관리하세요</p>
        </div>

        <Button onClick={() => setActiveTab("create")} className="gap-2">
          <Plus className="h-4 w-4" />새 전표 작성
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">전표 목록</TabsTrigger>
          <TabsTrigger value="create">전표 작성</TabsTrigger>
          {selectedJournal && <TabsTrigger value="view">전표 상세</TabsTrigger>}
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>전표 목록</CardTitle>
              <CardDescription>등록된 전표들을 확인하고 관리하세요</CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="전표번호, 적요, 계정과목으로 검색..."
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
                    <SelectItem value="승인됨">승인됨</SelectItem>
                    <SelectItem value="임시저장">임시저장</SelectItem>
                    <SelectItem value="반려">반려</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>전표번호</TableHead>
                    <TableHead>일자</TableHead>
                    <TableHead>적요</TableHead>
                    <TableHead>차변합계</TableHead>
                    <TableHead>대변합계</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJournals.map((journal) => (
                    <TableRow key={journal.id}>
                      <TableCell className="font-medium">{journal.id}</TableCell>
                      <TableCell>{journal.date}</TableCell>
                      <TableCell>{journal.description}</TableCell>
                      <TableCell className="text-right">₩{journal.totalDebit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₩{journal.totalCredit.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(journal.status)}>{journal.status}</Badge>
                      </TableCell>
                      <TableCell>{journal.createdBy}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => viewJournal(journal)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {journal.status === "임시저장" && (
                            <Button variant="ghost" size="icon" onClick={() => editJournal(journal)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>전표 정보</CardTitle>
                <CardDescription>전표의 기본 정보를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">전표일자</Label>
                  <Input
                    id="date"
                    type="date"
                    value={entryData.date}
                    onChange={(e) => setEntryData({ ...entryData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">전표번호</Label>
                  <Input
                    id="reference"
                    value={entryData.reference}
                    onChange={(e) => setEntryData({ ...entryData, reference: e.target.value })}
                    placeholder="자동 생성됩니다"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">적요</Label>
                  <Textarea
                    id="description"
                    value={entryData.description}
                    onChange={(e) => setEntryData({ ...entryData, description: e.target.value })}
                    placeholder="전표에 대한 설명을 입력하세요"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  분개 입력
                  <Button onClick={addJournalLine} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />행 추가
                  </Button>
                </CardTitle>
                <CardDescription>차변과 대변을 입력하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>계정과목</TableHead>
                      <TableHead>차변</TableHead>
                      <TableHead>대변</TableHead>
                      <TableHead>적요</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journalEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Select
                            value={entry.account}
                            onValueChange={(value) => updateJournalLine(entry.id, "account", value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="계정 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((account) => (
                                <SelectItem key={account.code} value={account.code}>
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={entry.debit || ""}
                            onChange={(e) => updateJournalLine(entry.id, "debit", Number(e.target.value))}
                            placeholder="0"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={entry.credit || ""}
                            onChange={(e) => updateJournalLine(entry.id, "credit", Number(e.target.value))}
                            placeholder="0"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={entry.description}
                            onChange={(e) => updateJournalLine(entry.id, "description", e.target.value)}
                            placeholder="적요"
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeJournalLine(entry.id)}
                            disabled={journalEntries.length <= 2}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-gray-50">
                      <TableCell>합계</TableCell>
                      <TableCell>{getTotalDebit().toLocaleString()}</TableCell>
                      <TableCell>{getTotalCredit().toLocaleString()}</TableCell>
                      <TableCell colSpan={2}>
                        {isBalanced() ? (
                          <span className="text-green-600">✓ 대차평형</span>
                        ) : (
                          <span className="text-red-600">✗ 대차불일치</span>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => saveJournalEntry(false)} disabled={!isBalanced()} className="gap-2">
                    <Save className="h-4 w-4" />
                    전표 저장
                  </Button>
                  <Button onClick={() => saveJournalEntry(true)} variant="outline" className="gap-2 bg-transparent">
                    <FileText className="h-4 w-4" />
                    임시 저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {selectedJournal && (
          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  전표 상세 - {selectedJournal.id}
                  <Badge className={getStatusColor(selectedJournal.status)}>{selectedJournal.status}</Badge>
                </CardTitle>
                <CardDescription>
                  작성일: {selectedJournal.createdAt} | 작성자: {selectedJournal.createdBy}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">전표일자</Label>
                    <p className="text-lg font-medium">{selectedJournal.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">전표번호</Label>
                    <p className="text-lg font-medium">{selectedJournal.reference}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">적요</Label>
                    <p className="text-lg font-medium">{selectedJournal.description}</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>계정과목</TableHead>
                      <TableHead>차변</TableHead>
                      <TableHead>대변</TableHead>
                      <TableHead>적요</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedJournal.entries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {entry.account} - {entry.accountName}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.debit > 0 ? `₩${entry.debit.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.credit > 0 ? `₩${entry.credit.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-gray-50">
                      <TableCell>합계</TableCell>
                      <TableCell className="text-right">₩{selectedJournal.totalDebit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₩{selectedJournal.totalCredit.toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="flex gap-2 mt-6">
                  {selectedJournal.status === "임시저장" && (
                    <Button onClick={() => editJournal(selectedJournal)} className="gap-2">
                      <Edit className="h-4 w-4" />
                      수정하기
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setActiveTab("list")} className="bg-transparent">
                    목록으로
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
