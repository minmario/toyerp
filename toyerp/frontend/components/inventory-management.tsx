"use client"

import { useState, useEffect } from "react"
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
import { Plus, Package, TrendingUp, TrendingDown, Search, RefreshCw, Edit, Trash2 } from "lucide-react"

// 백엔드 DB 구조에 맞는 타입 정의
interface Product {
  id: number
  name: string
  unit: string
  price: number
  code: string
  category: string
  currentStock: number  // 백엔드에서 계산된 재고
  minStock: number
  isDel: number
}

// 백엔드 거래 데이터 구조 (StockTransactionVO와 매핑)
interface StockTransaction {
  id: number
  productId: number
  transactionType: string // "IN" | "OUT"
  quantity: number
  transactionDate: string
  details: string
  isDel: number
}

// 프론트엔드에서 사용할 거래 데이터
interface Transaction {
  id: number
  productId: number
  productName: string
  type: string
  quantity: number
  date: string
  note: string
}

export function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [productAddLoading, setProductAddLoading] = useState(false) // 상품 등록 로딩 상태

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    unit: "",
    code: "", // 상품코드 추가
    minStock: "", // 빈 문자열로 초기화
    price: "", // 빈 문자열로 초기화
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

  // 상단 state 구역에 추가
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    id: 0,
    name: "",
    code: "",
    category: "",
    unit: "",
    minStock: "",
    price: "",
  })
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [productEditLoading, setProductEditLoading] = useState(false)

  // 거래 수정 다이얼로그 상태
  const [isTransactionEditDialogOpen, setIsTransactionEditDialogOpen] = useState(false)
  const [editTx, setEditTx] = useState({
    id: 0,
    productId: "",         // Select는 string
    type: "입고" as "입고" | "출고",
    quantity: 0,
    note: "",
    date: ""               // 선택: "YYYY-MM-DD"
  })

  // 백엔드에서 제품 데이터 가져오기
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const apiUrl = 'http://localhost:8080/api/products'
      console.log('제품 API 호출:', apiUrl)
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`제품 API 호출 실패: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('받은 제품 데이터:', data)
      
      const activeProducts = data.filter((product: Product) => product.isDel === 0)
      setProducts(activeProducts)
      setError(null)
    } catch (err) {
      console.error('제품 데이터 로딩 실패:', err)
      setError('백엔드 API 연결 실패 - 서버가 실행 중인지 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  // 백엔드에서 거래 데이터 가져오기
  const fetchTransactions = async () => {
    try {
      setTransactionLoading(true)
      const apiUrl = 'http://localhost:8080/api/transactions'
      console.log('거래 API 호출:', apiUrl)
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`거래 API 호출 실패: ${response.status}`)
      }
      
      const data: StockTransaction[] = await response.json()
      console.log('받은 거래 데이터:', data)
      
      setStockTransactions(data)
      
      // 거래 데이터를 프론트엔드 형식으로 변환
      const formattedTransactions: Transaction[] = data.map(transaction => ({
        id: transaction.id,
        productId: transaction.productId,
        productName: getProductName(transaction.productId),
        type: transaction.transactionType === "IN" ? "입고" : "출고",
        quantity: transaction.quantity,
        date: transaction.transactionDate,
        note: transaction.details
      }))
      
      setTransactions(formattedTransactions)
      setError(null)
    } catch (err) {
      console.error('거래 데이터 로딩 실패:', err)
      // 거래 데이터는 선택적이므로 전체 에러로 처리하지 않음
    } finally {
      setTransactionLoading(false)
    }
  }

  // 제품 ID로 제품명 찾기
  const getProductName = (productId: number): string => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : `제품 ID: ${productId}`
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchProducts()
  }, [])

  // 제품 데이터가 로드된 후 거래 데이터 로드
  useEffect(() => {
    if (products.length > 0) {
      fetchTransactions()
    }
  }, [products])

  // 데이터 새로고침
  const handleRefresh = async () => {
    await fetchProducts()
  }

  // 상품코드 중복 체크
  const checkCodeDuplicate = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/check-code?code=${code}`)
      if (response.ok) {
        return await response.json()
      }
      return false
    } catch (err) {
      console.error('상품코드 중복 체크 실패:', err)
      return false
    }
  }

  // 제품 추가 구현
  const handleAddProduct = async () => {
    // 입력값 검증
    if (!newProduct.name.trim()) {
      alert('제품명을 입력해주세요.')
      return
    }
    if (!newProduct.code.trim()) {
      alert('상품코드를 입력해주세요.')
      return
    }
    if (!newProduct.unit.trim()) {
      alert('단위를 선택해주세요.')
      return
    }
    if (!newProduct.category.trim()) {
      alert('카테고리를 입력해주세요.')
      return
    }
    if (newProduct.price === "" || Number(newProduct.price) <= 0) {
      alert('가격을 입력해주세요.')
      return
    }
    if (newProduct.minStock === "" || Number(newProduct.minStock) < 0) {
      alert('최소재고는 0 이상이어야 합니다.')
      return
    }

    // 상품코드 중복 체크
    const isDuplicate = await checkCodeDuplicate(newProduct.code)
    if (isDuplicate) {
      alert('이미 존재하는 상품코드입니다.')
      return
    }

    try {
      setProductAddLoading(true)
      
      // 백엔드 API 호출
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          unit: newProduct.unit,
          price: Number(newProduct.price),
          code: newProduct.code,
          category: newProduct.category,
          minStock: Number(newProduct.minStock) || 0, // 빈 값이면 0으로 처리
        }),
      })

      if (response.ok) {
        const message = await response.text()
        alert(message) // "상품이 성공적으로 등록되었습니다."
        
        // 폼 초기화
        setNewProduct({
          name: "",
          category: "",
          unit: "",
          code: "",
          minStock: "",
          price: "",
        })
        
        // 다이얼로그 닫기
        setIsProductDialogOpen(false)
        
        // 제품 목록 새로고침
        await fetchProducts()
      } else {
        const errorMessage = await response.text()
        alert(`상품 등록 실패: ${errorMessage}`)
      }
    } catch (err) {
      console.error('상품 등록 오류:', err)
      alert('상품 등록 중 오류가 발생했습니다.')
    } finally {
      setProductAddLoading(false)
    }
  }

  // 제품 수정
  const handleEditProduct = (product: Product) => {
    setEditTarget(product)
    setEditForm({
      id: product.id,
      name: product.name,
      code: product.code,
      category: product.category,
      unit: product.unit,
      minStock: String(product.minStock ?? 0),
      price: String(product.price ?? 0),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = async () => {
  if (!editForm.name.trim()) return alert("제품명을 입력해주세요.")
  if (!editForm.code.trim()) return alert("상품코드를 입력해주세요.")
  if (!editForm.unit.trim()) return alert("단위를 선택해주세요.")
  if (!editForm.category.trim()) return alert("카테고리를 입력해주세요.")

  const priceNum = Number(editForm.price)
  const minStockNum = Number(editForm.minStock)
  if (Number.isNaN(priceNum) || priceNum <= 0) return alert("가격을 올바르게 입력해주세요.")
  if (Number.isNaN(minStockNum) || minStockNum < 0) return alert("최소재고는 0 이상이어야 합니다.")

  // (선택) 코드가 변경된 경우에만 중복 체크
  if (editTarget && editTarget.code !== editForm.code) {
    const dup = await checkCodeDuplicate(editForm.code) // 이미 있는 함수라면 재사용
    if (dup) return alert("이미 존재하는 상품코드입니다.")
  }

  try {
    setProductEditLoading(true)

    const res = await fetch("http://localhost:8080/api/products/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editForm.id,                 // ← 백엔드 DTO(ProductUpdateRequest) 기준
        name: editForm.name,
        unit: editForm.unit,
        price: Number(editForm.price),
        code: editForm.code,
        category: editForm.category,
        minStock: Number(editForm.minStock),
      }),
    })

    // 응답이 문자열/JSON 어느 쪽이든 안전하게 처리
    const contentType = res.headers.get("content-type") || ""
    const payload = contentType.includes("application/json") ? await res.json() : await res.text()

    if (!res.ok) {
      return alert(typeof payload === "string" ? payload : (payload.message ?? "수정 실패"))
    }

    alert(typeof payload === "string" ? payload : (payload.message ?? "상품이 수정되었습니다."))
    setIsEditDialogOpen(false)
    setEditTarget(null)
    await fetchProducts()
  } catch (e) {
    console.error(e)
    alert("상품 수정 중 오류가 발생했습니다.")
  } finally {
    setProductEditLoading(false)
  }
}

  // 제품 삭제 (논리 삭제)
  const handleDeleteProduct = (product: Product) => {
    if (confirm(`정말 "${product.name}" 제품을 삭제하시겠습니까?`)) {
      alert(`제품 삭제 기능 (${product.name}) - 백엔드 DELETE API 구현 후 사용 가능합니다.`)
    }
  }

const handleAddTransaction = async () => {
  if (!newTransaction.productId) return alert("제품을 선택해주세요.")
  if (!newTransaction.type) return alert("구분을 선택해주세요.")
  if (!newTransaction.quantity || newTransaction.quantity <= 0) return alert("수량은 1 이상이어야 합니다.")

  try {
    setTransactionLoading(true)

    const res = await fetch("http://localhost:8080/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: Number(newTransaction.productId),
        transactionType: newTransaction.type === "입고" ? "IN" : "OUT",
        quantity: Number(newTransaction.quantity),
        details: newTransaction.note || ""
      })
    })

    const isJson = (res.headers.get("content-type") || "").includes("application/json")
    const payload = isJson ? await res.json() : await res.text()

    if (!res.ok) {
      return alert(typeof payload === "string" ? payload : (payload.message ?? "등록 실패"))
    }


    //알림
    alert(typeof payload === "string" ? payload : (payload.message ?? "입출고 내역이 등록되었습니다."))

    //모달 닫기
    setIsTransactionDialogOpen(false)

    //폼 초기화
    setNewTransaction({ productId: "", type: "입고", quantity: 0, note: "" })

    //목록/재고 갱신
    await fetchProducts()
    await fetchTransactions()

  } catch (e) {
    console.error(e)
    alert("입출고 등록 중 오류가 발생했습니다.")
  } finally {
    setTransactionLoading(false)
  }
}

  // 거래 수정
const handleEditTransaction = (t: Transaction) => {
  setEditTx({
    id: t.id,
    productId: String(t.productId),
    type: t.type as "입고" | "출고",
    quantity: t.quantity,
    note: t.note || "",
    // ISO 날짜만 추출 (YYYY-MM-DD)
    date: t.date ? t.date.substring(0, 10) : ""
  })
  setIsTransactionEditDialogOpen(true)
}

const handleUpdateTransaction = async () => {
  if (!editTx.productId) return alert("제품을 선택해주세요.")
  if (!editTx.type) return alert("구분을 선택해주세요.")
  if (!editTx.quantity || editTx.quantity <= 0) return alert("수량은 1 이상이어야 합니다.")

  try {
    setTransactionLoading(true)

    const res = await fetch("http://localhost:8080/api/transactions/update", {
      method: "POST", // 프로젝트 규칙에 맞춰 POST 사용
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editTx.id,
        productId: Number(editTx.productId),
        transactionType: editTx.type === "입고" ? "IN" : "OUT", // ENUM에 맞게 변환
        quantity: Number(editTx.quantity),
        details: editTx.note || "",
        transactionDate: editTx.date || null
      })
    })

    const isJson = (res.headers.get("content-type") || "").includes("application/json")
    const payload = isJson ? await res.json() : await res.text()

    if (!res.ok) {
      return alert(typeof payload === "string" ? payload : (payload.message ?? "수정 실패"))
    }



    alert(typeof payload === "string" ? payload : (payload.message ?? "입출고 내역이 수정되었습니다."))

    
    // 닫고 초기화
    setIsTransactionEditDialogOpen(false)
    setEditTx({ id: 0, productId: "", type: "입고", quantity: 0, note: "", date: "" })

    // 목록 갱신
    await fetchProducts()
    await fetchTransactions()

  } catch (e) {
    console.error(e)
    alert("입출고 수정 중 오류가 발생했습니다.")
  } finally {
    setTransactionLoading(false)
  }
}

  // 거래 삭제 (논리 삭제)
  const handleDeleteTransaction = (transaction: Transaction) => {
    if (confirm(`정말 이 거래 내역을 삭제하시겠습니까?\n${transaction.date} - ${transaction.productName} ${transaction.type} ${transaction.quantity}`)) {
      alert(`거래 삭제 기능 (ID: ${transaction.id}) - 백엔드 DELETE API 구현 후 사용 가능합니다.`)
    }
  }

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { label: "품절", color: "bg-red-100 text-red-800" }
    if (current <= min) return { label: "부족", color: "bg-yellow-100 text-yellow-800" }
    return { label: "정상", color: "bg-green-100 text-green-800" }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="text-red-500 text-center">
          <p>오류: {error}</p>
        </div>
        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
      </div>
    )
  }

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
                  <Label htmlFor="product-name">제품명 *</Label>
                  <Input
                    id="product-name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="제품명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-code">상품코드 *</Label>
                  <Input
                    id="product-code"
                    value={newProduct.code}
                    onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                    placeholder="P001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리 *</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    placeholder="전자제품"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">단위 *</Label>
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
                    onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                    placeholder="10"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">가격 *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="100000"
                    min="0"
                  />
                </div>
                <Button 
                  onClick={handleAddProduct} 
                  className="w-full"
                  disabled={productAddLoading}
                >
                  {productAddLoading ? "등록 중..." : "등록하기"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>제품 수정</DialogTitle>
      <DialogDescription>제품 정보를 수정하세요</DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">제품명 *</Label>
        <Input
          id="edit-name"
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          placeholder="제품명을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-code">상품코드 *</Label>
        <Input
          id="edit-code"
          value={editForm.code}
          onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
          placeholder="P001"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-category">카테고리 *</Label>
        <Input
          id="edit-category"
          value={editForm.category}
          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          placeholder="전자제품"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-unit">단위 *</Label>
        <Select
          value={editForm.unit}
          onValueChange={(v) => setEditForm({ ...editForm, unit: v })}
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
        <Label htmlFor="edit-min">최소재고</Label>
        <Input
          id="edit-min"
          type="number"
          min={0}
          value={editForm.minStock}
          onChange={(e) => setEditForm({ ...editForm, minStock: e.target.value })}
          placeholder="10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-price">가격 *</Label>
        <Input
          id="edit-price"
          type="number"
          min={0}
          value={editForm.price}
          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
          placeholder="100000"
        />
      </div>

      <Button
        onClick={handleUpdateProduct}
        className="w-full"
        disabled={productEditLoading}
      >
        {productEditLoading ? "수정 중..." : "수정 저장"}
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
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} (현재: {product.currentStock}{product.unit})
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

          <Dialog open={isTransactionEditDialogOpen} onOpenChange={setIsTransactionEditDialogOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>입출고 수정</DialogTitle>
      <DialogDescription>선택한 입출고 내역을 수정합니다</DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <div className="space-y-2">
        <Label>제품</Label>
        <Select
          value={editTx.productId}
          onValueChange={(v) => setEditTx({ ...editTx, productId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="제품 선택" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id.toString()}>
                {p.name} (현재: {p.currentStock}{p.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>구분</Label>
        <Select
          value={editTx.type}
          onValueChange={(v) => setEditTx({ ...editTx, type: v as "입고" | "출고" })}
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
        <Label>수량</Label>
        <Input
          type="number"
          min={1}
          value={editTx.quantity}
          onChange={(e) => setEditTx({ ...editTx, quantity: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label>일자</Label>
        <Input
          type="date"
          value={editTx.date}
          onChange={(e) => setEditTx({ ...editTx, date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>비고</Label>
        <Input
          value={editTx.note}
          onChange={(e) => setEditTx({ ...editTx, note: e.target.value })}
          placeholder="수정 사유 등"
        />
      </div>

      <Button onClick={handleUpdateTransaction} className="w-full" disabled={transactionLoading}>
        {transactionLoading ? "수정 중..." : "수정 저장"}
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
              <CardDescription>
                등록된 제품들의 실시간 재고 현황을 확인하세요
                {transactionLoading && " (거래 데이터 로딩 중...)"}
              </CardDescription>
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
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product.currentStock, product.minStock)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-semibold">
                          {product.currentStock} {product.unit}
                        </TableCell>
                        <TableCell>
                          {product.minStock} {product.unit}
                        </TableCell>
                        <TableCell>
                          ₩{product.price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
              <CardDescription>
                제품의 입출고 내역을 확인하세요
                {transactionLoading && " (로딩 중...)"}
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
                    <TableHead>비고</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
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
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTransaction(transaction)}
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTransaction(transaction)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        {transactionLoading ? "거래 데이터를 불러오는 중..." : "거래 내역이 없습니다."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}