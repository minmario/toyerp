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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, TrendingUp, TrendingDown, Search } from "lucide-react"

export function InventoryManagement() {
  const [products, setProducts] = useState([
    {
      id: "P001",
      name: "노트북",
      category: "전자제품",
      unit: "대",
      currentStock: 25,
      minStock: 10,
      unitPrice: 1200000,
    },
    { id: "P002", name: "마우스", category: "전자제품", unit: "개", currentStock: 150, minStock: 50, unitPrice: 25000 },
    { id: "P003", name: "키보드", category: "전자제품", unit: "개", currentStock: 8, minStock: 20, unitPrice: 80000 },
    { id: "P004", name: "모니터", category: "전자제품", unit: "대", currentStock: 45, minStock: 15, unitPrice: 300000 },
  ])

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      productId: "P001",
      productName: "노트북",
      type: "입고",
      quantity: 10,
      date: "2024-01-15",
      note: "신규 입고",
    },
    { id: 2, productId: "P002", productName: "마우스", type: "출고", quantity: 25, date: "2024-01-16", note: "판매" },
    { id: 3, productId: "P001", productName: "노트북", type: "출고", quantity: 5, date: "2024-01-17", note: "판매" },
  ])

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    unit: "",
    minStock: 0,
    unitPrice: 0,
  })

  const [newTransaction, setNewTransaction] = useState({
    productId: "",
    type: "입고",
    quantity: 0,
    note: "",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)

  const handleAddProduct = () => {
    const productId = `P${String(products.length + 1).padStart(3, "0")}`
    const product = {
      ...newProduct,
      id: productId,
      currentStock: 0,
    }
    setProducts([...products, product])
    setNewProduct({ name: "", category: "", unit: "", minStock: 0, unitPrice: 0 })
    setIsProductDialogOpen(false)
  }

  const handleAddTransaction = () => {
    const product = products.find((p) => p.id === newTransaction.productId)
    if (!product) return

    const transaction = {
      id: transactions.length + 1,
      productId: newTransaction.productId,
      productName: product.name,
      type: newTransaction.type,
      quantity: newTransaction.quantity,
      date: new Date().toISOString().split("T")[0],
      note: newTransaction.note,
    }

    setTransactions([...transactions, transaction])

    // 재고 수량 업데이트
    setProducts(
      products.map((p) => {
        if (p.id === newTransaction.productId) {
          const newStock =
            newTransaction.type === "입고"
              ? p.currentStock + newTransaction.quantity
              : p.currentStock - newTransaction.quantity
          return { ...p, currentStock: Math.max(0, newStock) }
        }
        return p
      }),
    )

    setNewTransaction({ productId: "", type: "입고", quantity: 0, note: "" })
    setIsTransactionDialogOpen(false)
  }

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { label: "품절", color: "bg-red-100 text-red-800" }
    if (current <= min) return { label: "부족", color: "bg-yellow-100 text-yellow-800" }
    return { label: "정상", color: "bg-green-100 text-green-800" }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">재고 관리</h1>
          <p className="text-gray-600 mt-2">제품 재고를 등록하고 입출고를 관리하세요</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Package className="h-4 w-4" />
                제품 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>새 제품 등록</DialogTitle>
                <DialogDescription>새로운 제품을 등록하세요</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">제품명</Label>
                  <Input
                    id="product-name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="제품명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="전자제품"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">단위</Label>
                  <Select
                    value={newProduct.unit}
                    onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="단위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="개">개</SelectItem>
                      <SelectItem value="대">대</SelectItem>
                      <SelectItem value="박스">박스</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-stock">최소재고</Label>
                  <Input
                    id="min-stock"
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({ ...newProduct, minStock: Number(e.target.value) })}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-price">단가</Label>
                  <Input
                    id="unit-price"
                    type="number"
                    value={newProduct.unitPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })}
                    placeholder="100000"
                  />
                </div>
                <Button onClick={handleAddProduct} className="w-full">
                  등록하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                입출고 등록
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>입출고 등록</DialogTitle>
                <DialogDescription>제품의 입고 또는 출고를 등록하세요</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">제품</Label>
                  <Select
                    value={newTransaction.productId}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, productId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="제품 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (현재: {product.currentStock}
                          {product.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">구분</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="입고">입고</SelectItem>
                      <SelectItem value="출고">출고</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">수량</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newTransaction.quantity}
                    onChange={(e) => setNewTransaction({ ...newTransaction, quantity: Number(e.target.value) })}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">비고</Label>
                  <Input
                    id="note"
                    value={newTransaction.note}
                    onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                    placeholder="입출고 사유"
                  />
                </div>
                <Button onClick={handleAddTransaction} className="w-full">
                  등록하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">제품 목록</TabsTrigger>
          <TabsTrigger value="transactions">입출고 이력</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>제품 재고 현황</CardTitle>
              <CardDescription>등록된 제품들의 재고 현황을 확인하세요</CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="제품명, 코드로 검색..."
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
                    <TableHead>제품코드</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>현재재고</TableHead>
                    <TableHead>최소재고</TableHead>
                    <TableHead>단가</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product.currentStock, product.minStock)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {product.currentStock} {product.unit}
                        </TableCell>
                        <TableCell>
                          {product.minStock} {product.unit}
                        </TableCell>
                        <TableCell>₩{product.unitPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>입출고 이력</CardTitle>
              <CardDescription>제품의 입출고 내역을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>일자</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead>구분</TableHead>
                    <TableHead>수량</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.productName}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "입고" ? "default" : "secondary"} className="gap-1">
                          {transaction.type === "입고" ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
