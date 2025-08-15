"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Star, Package } from "lucide-react"

interface ProductCatalogProps {
  userInfo: any
}

export function ProductCatalog({ userInfo }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("전체")
  const [cart, setCart] = useState<any[]>([])

  const products = [
    {
      id: "P001",
      name: "비즈니스 노트북",
      category: "전자제품",
      description: "고성능 업무용 노트북",
      basePrice: 1200000,
      vipPrice: 1080000,
      partnerPrice: 1050000,
      stock: 25,
      minOrder: 1,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "P002",
      name: "무선 마우스",
      category: "전자제품",
      description: "인체공학적 무선 마우스",
      basePrice: 25000,
      vipPrice: 22500,
      partnerPrice: 20000,
      stock: 150,
      minOrder: 10,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "P003",
      name: "기계식 키보드",
      category: "전자제품",
      description: "프리미엄 기계식 키보드",
      basePrice: 80000,
      vipPrice: 72000,
      partnerPrice: 70000,
      stock: 8,
      minOrder: 5,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "P004",
      name: "4K 모니터",
      category: "전자제품",
      description: "27인치 4K UHD 모니터",
      basePrice: 300000,
      vipPrice: 270000,
      partnerPrice: 250000,
      stock: 45,
      minOrder: 2,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const getPrice = (product: any) => {
    switch (userInfo.customerType) {
      case "VIP_CUSTOMER":
        return product.vipPrice
      case "PARTNER":
        return product.partnerPrice
      default:
        return product.basePrice
    }
  }

  const getDiscountRate = (product: any) => {
    const currentPrice = getPrice(product)
    return Math.round(((product.basePrice - currentPrice) / product.basePrice) * 100)
  }

  const addToCart = (product: any, quantity: number) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)))
    } else {
      setCart([...cart, { ...product, quantity, price: getPrice(product) }])
    }
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "전체" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">상품 카탈로그</h1>
          <p className="text-gray-600 mt-2">
            {userInfo.customerType === "VIP_CUSTOMER" && "VIP 특가로 제공됩니다"}
            {userInfo.customerType === "PARTNER" && "파트너 특별가로 제공됩니다"}
            {userInfo.customerType === "CUSTOMER" && "일반 고객가로 제공됩니다"}
          </p>
        </div>
        <Button className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          장바구니 ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>상품 검색</CardTitle>
          <CardDescription>원하는 상품을 찾아보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="상품명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 카테고리</SelectItem>
                <SelectItem value="전자제품">전자제품</SelectItem>
                <SelectItem value="사무용품">사무용품</SelectItem>
                <SelectItem value="가구">가구</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const currentPrice = getPrice(product)
          const discountRate = getDiscountRate(product)

          return (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {discountRate > 0 && <Badge className="absolute top-2 right-2 bg-red-500">{discountRate}% 할인</Badge>}
                {userInfo.customerType === "VIP_CUSTOMER" && (
                  <Badge className="absolute top-2 left-2 bg-gold-500 gap-1">
                    <Star className="h-3 w-3" />
                    VIP
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      {discountRate > 0 && (
                        <p className="text-sm text-gray-500 line-through">₩{product.basePrice.toLocaleString()}</p>
                      )}
                      <p className="text-xl font-bold text-blue-600">₩{currentPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">재고: {product.stock}개</p>
                      <p className="text-xs text-gray-500">최소주문: {product.minOrder}개</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={product.minOrder}
                      max={product.stock}
                      defaultValue={product.minOrder}
                      className="w-20"
                      id={`quantity-${product.id}`}
                    />
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => {
                        const quantityInput = document.getElementById(`quantity-${product.id}`) as HTMLInputElement
                        const quantity = Number.parseInt(quantityInput.value) || product.minOrder
                        addToCart(product, quantity)
                      }}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {product.stock === 0 ? "품절" : "장바구니"}
                    </Button>
                  </div>

                  {product.stock <= 10 && product.stock > 0 && (
                    <p className="text-sm text-orange-600 flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      재고 부족 (잔여: {product.stock}개)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">검색 조건에 맞는 상품이 없습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
