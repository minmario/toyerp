"use client"

import { useState } from "react"
import { PortalSidebar } from "@/components/portal-sidebar"
import { PortalHeader } from "@/components/portal-header"
import { Dashboard } from "@/components/dashboard"
import { ProductCatalog } from "@/components/product-catalog"
import { OrderManagement } from "@/components/order-management"
import { QuoteRequests } from "@/components/quote-requests"
import { CompanyProfile } from "@/components/company-profile"

export default function Page() {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [userInfo] = useState({
    companyCode: "COMP001",
    companyName: "(주)테크솔루션",
    contactPerson: "김구매",
    customerType: "VIP_CUSTOMER", // CUSTOMER, VIP_CUSTOMER, PARTNER
    creditLimit: 50000000,
    usedCredit: 12000000,
  })

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <Dashboard userInfo={userInfo} />
      case "products":
        return <ProductCatalog userInfo={userInfo} />
      case "orders":
        return <OrderManagement userInfo={userInfo} />
      case "quotes":
        return <QuoteRequests userInfo={userInfo} />
      case "profile":
        return <CompanyProfile userInfo={userInfo} />
      default:
        return <Dashboard userInfo={userInfo} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <PortalSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} userInfo={userInfo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PortalHeader userInfo={userInfo} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
