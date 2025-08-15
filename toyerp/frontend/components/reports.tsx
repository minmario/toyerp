"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Calendar, BarChart3 } from "lucide-react"

export function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  })

  const [reportType, setReportType] = useState("journal")

  const journalData = [
    { date: "2024-01-15", reference: "JE-001", account: "현금", debit: 1000000, credit: 0, description: "매출 입금" },
    { date: "2024-01-15", reference: "JE-001", account: "매출", debit: 0, credit: 1000000, description: "상품 판매" },
    { date: "2024-01-16", reference: "JE-002", account: "급여", debit: 2000000, credit: 0, description: "급여 지급" },
    { date: "2024-01-16", reference: "JE-002", account: "현금", debit: 0, credit: 2000000, description: "급여 지급" },
  ]

  const inventoryData = [
    { date: "2024-01-15", product: "노트북", type: "입고", quantity: 10, unitPrice: 1200000, total: 12000000 },
    { date: "2024-01-16", product: "마우스", type: "출고", quantity: 25, unitPrice: 25000, total: 625000 },
    { date: "2024-01-17", product: "노트북", type: "출고", quantity: 5, unitPrice: 1200000, total: 6000000 },
  ]

  const generatePDF = () => {
    // 실제로는 PDF 생성 라이브러리를 사용
    alert("PDF 보고서가 생성되었습니다.")
  }

  const exportExcel = () => {
    // 실제로는 Excel 내보내기 기능
    alert("Excel 파일로 내보내기가 완료되었습니다.")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">보고서</h1>
          <p className="text-gray-600 mt-2">전표 및 재고 이력을 조회하고 PDF로 출력하세요</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportExcel} variant="outline" className="gap-2 bg-transparent">
            <BarChart3 className="h-4 w-4" />
            Excel 내보내기
          </Button>
          <Button onClick={generatePDF} className="gap-2">
            <Download className="h-4 w-4" />
            PDF 출력
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            조회 조건
          </CardTitle>
          <CardDescription>보고서 생성을 위한 조건을 설정하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">보고서 유형</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journal">전표 이력</SelectItem>
                  <SelectItem value="inventory">재고 이력</SelectItem>
                  <SelectItem value="summary">요약 보고서</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">시작일</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">종료일</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">조회</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
        <TabsList>
          <TabsTrigger value="journal">전표 이력</TabsTrigger>
          <TabsTrigger value="inventory">재고 이력</TabsTrigger>
          <TabsTrigger value="summary">요약 보고서</TabsTrigger>
        </TabsList>

        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                전표 이력 보고서
              </CardTitle>
              <CardDescription>
                {dateRange.startDate} ~ {dateRange.endDate} 기간의 전표 내역
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>일자</TableHead>
                    <TableHead>전표번호</TableHead>
                    <TableHead>계정과목</TableHead>
                    <TableHead>차변</TableHead>
                    <TableHead>대변</TableHead>
                    <TableHead>적요</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journalData.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.reference}</TableCell>
                      <TableCell>{entry.account}</TableCell>
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
                    <TableCell colSpan={3}>합계</TableCell>
                    <TableCell className="text-right">
                      ₩{journalData.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ₩{journalData.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                재고 이력 보고서
              </CardTitle>
              <CardDescription>
                {dateRange.startDate} ~ {dateRange.endDate} 기간의 재고 입출고 내역
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>일자</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead>구분</TableHead>
                    <TableHead>수량</TableHead>
                    <TableHead>단가</TableHead>
                    <TableHead>금액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.product}</TableCell>
                      <TableCell>
                        <span className={entry.type === "입고" ? "text-blue-600" : "text-red-600"}>{entry.type}</span>
                      </TableCell>
                      <TableCell className="text-right">{entry.quantity}</TableCell>
                      <TableCell className="text-right">₩{entry.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₩{entry.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-50">
                    <TableCell colSpan={5}>총 거래금액</TableCell>
                    <TableCell className="text-right">
                      ₩{inventoryData.reduce((sum, entry) => sum + entry.total, 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>재무 요약</CardTitle>
                <CardDescription>주요 재무 지표</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">총 매출</span>
                  <span className="text-xl font-bold text-blue-600">₩1,000,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">총 비용</span>
                  <span className="text-xl font-bold text-red-600">₩2,000,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">순이익</span>
                  <span className="text-xl font-bold text-green-600">₩-1,000,000</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>재고 요약</CardTitle>
                <CardDescription>재고 현황 요약</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">총 제품 수</span>
                  <span className="text-xl font-bold text-purple-600">4개</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">재고 부족 제품</span>
                  <span className="text-xl font-bold text-orange-600">1개</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">총 재고 가치</span>
                  <span className="text-xl font-bold text-gray-600">₩43,750,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
