"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react"

interface QuoteRequestsProps {
  userInfo: any
}

export function QuoteRequests({ userInfo }: QuoteRequestsProps) {
  const [quotes, setQuotes] = useState([
    {
      id: "QT-2024-001",
      date: "2024-01-10",
      status: "승인됨",
      items: [
        { name: "비즈니스 노트북", quantity: 50, estimatedPrice: 1050000 },
        { name: "무선 마우스", quantity: 50, estimatedPrice: 20000 },
      ],
      totalEstimate: 53500000,
      finalPrice: 52000000,
      validUntil: "2024-02-10",
      notes: "대량 주문으로 특별 할인 적용",
      response: "50대 이상 주문 시 추가 3% 할인 가능합니다.",
    },
    {
      id: "QT-2024-002",
      date: "2024-01-15",
      status: "검토중",
      items: [
        { name: "4K 모니터", quantity: 20, estimatedPrice: 250000 },
        { name: "기계식 키보드", quantity: 20, estimatedPrice: 70000 },
      ],
      totalEstimate: 6400000,
      validUntil: "2024-02-15",
      notes: "신규 사무실 구축용",
    },
    {
      id: "QT-2024-003",
      date: "2024-01-20",
      status: "거절됨",
      items: [{ name: "비즈니스 노트북", quantity: 5, estimatedPrice: 1080000 }],
      totalEstimate: 5400000,
      validUntil: "2024-02-20",
      notes: "소량 주문",
      response: "최소 주문 수량 미달로 견적 제공이 어렵습니다.",
    },
  ])

  const [newQuote, setNewQuote] = useState({
    items: [{ name: "", quantity: 0, notes: "" }],
    generalNotes: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addQuoteItem = () => {
    setNewQuote({
      ...newQuote,
      items: [...newQuote.items, { name: "", quantity: 0, notes: "" }],
    })
  }

  const updateQuoteItem = (index: number, field: string, value: any) => {
    const updatedItems = newQuote.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setNewQuote({ ...newQuote, items: updatedItems })
  }

  const removeQuoteItem = (index: number) => {
    setNewQuote({
      ...newQuote,
      items: newQuote.items.filter((_, i) => i !== index),
    })
  }

  const submitQuote = () => {
    const quoteId = `QT-2024-${String(quotes.length + 1).padStart(3, "0")}`
    const newQuoteRequest = {
      id: quoteId,
      date: new Date().toISOString().split("T")[0],
      status: "검토중",
      items: newQuote.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        estimatedPrice: 0,
      })),
      totalEstimate: 0,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      notes: newQuote.generalNotes,
    }

    setQuotes([newQuoteRequest, ...quotes])
    setNewQuote({
      items: [{ name: "", quantity: 0, notes: "" }],
      generalNotes: "",
    })
    setIsDialogOpen(false)
    alert("견적 요청이 제출되었습니다.")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "승인됨":
        return <CheckCircle className="h-4 w-4" />
      case "거절됨":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "승인됨":
        return "bg-green-100 text-green-800"
      case "거절됨":
        return "bg-red-100 text-red-800"
      case "검토중":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">견적 요청</h1>
          <p className="text-gray-600 mt-2">대량 주문이나 특별 가격이 필요한 경우 견적을 요청하세요</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              견적 요청
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 견적 요청</DialogTitle>
              <DialogDescription>필요한 상품과 수량을 입력하여 견적을 요청하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">요청 상품</Label>
                <div className="space-y-3 mt-2">
                  {newQuote.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label htmlFor={`item-name-${index}`}>상품명</Label>
                        <Input
                          id={`item-name-${index}`}
                          value={item.name}
                          onChange={(e) => updateQuoteItem(index, "name", e.target.value)}
                          placeholder="상품명 입력"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor={`item-quantity-${index}`}>수량</Label>
                        <Input
                          id={`item-quantity-${index}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuoteItem(index, "quantity", Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor={`item-notes-${index}`}>비고</Label>
                        <Input
                          id={`item-notes-${index}`}
                          value={item.notes}
                          onChange={(e) => updateQuoteItem(index, "notes", e.target.value)}
                          placeholder="특별 요구사항"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeQuoteItem(index)}
                          disabled={newQuote.items.length === 1}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addQuoteItem} className="mt-2 bg-transparent">
                  상품 추가
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="general-notes">전체 요청사항</Label>
                <Textarea
                  id="general-notes"
                  value={newQuote.generalNotes}
                  onChange={(e) => setNewQuote({ ...newQuote, generalNotes: e.target.value })}
                  placeholder="견적 요청에 대한 추가 설명이나 요구사항을 입력하세요"
                  rows={3}
                />
              </div>

              <Button onClick={submitQuote} className="w-full">
                견적 요청 제출
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {quotes.map((quote) => (
          <Card key={quote.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {quote.id}
                    <Badge className={`gap-1 ${getStatusColor(quote.status)}`}>
                      {getStatusIcon(quote.status)}
                      {quote.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>요청일: {quote.date}</CardDescription>
                </div>
                <div className="text-right">
                  {quote.finalPrice ? (
                    <div>
                      <p className="text-sm text-gray-500 line-through">
                        예상: ₩{quote.totalEstimate.toLocaleString()}
                      </p>
                      <p className="text-2xl font-bold text-green-600">최종: ₩{quote.finalPrice.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-blue-600">예상: ₩{quote.totalEstimate.toLocaleString()}</p>
                  )}
                  <p className="text-sm text-gray-500">유효기간: {quote.validUntil}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">요청 상품</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>상품명</TableHead>
                        <TableHead>수량</TableHead>
                        <TableHead>예상 단가</TableHead>
                        <TableHead>예상 합계</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quote.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}개</TableCell>
                          <TableCell>
                            {item.estimatedPrice > 0 ? `₩${item.estimatedPrice.toLocaleString()}` : "견적 대기"}
                          </TableCell>
                          <TableCell>
                            {item.estimatedPrice > 0
                              ? `₩${(item.estimatedPrice * item.quantity).toLocaleString()}`
                              : "견적 대기"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {quote.notes && (
                  <div>
                    <h4 className="font-medium mb-2">요청사항</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{quote.notes}</p>
                  </div>
                )}

                {quote.response && (
                  <div>
                    <h4 className="font-medium mb-2">답변</h4>
                    <p className="text-gray-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                      {quote.response}
                    </p>
                  </div>
                )}

                {quote.status === "승인됨" && quote.finalPrice && (
                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" />
                      주문하기
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quotes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">아직 견적 요청이 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">대량 주문이나 특별 가격이 필요한 경우 견적을 요청해보세요.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
