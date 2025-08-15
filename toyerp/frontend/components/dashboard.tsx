"use client"

import { PortalDashboard } from "@/components/portal-dashboard"

interface DashboardProps {
  userInfo: any
}

export function Dashboard({ userInfo }: DashboardProps) {
  return <PortalDashboard userInfo={userInfo} />
}
