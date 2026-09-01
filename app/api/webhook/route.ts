import { NextRequest, NextResponse } from 'next/server'
import { POST as adminHandler } from '../webhooks/admin/route'
import { POST as orderHandler } from '../webhooks/order/route'
import { POST as paymentHandler } from '../webhooks/payment/route'
import { POST as supportHandler } from '../webhooks/support/route'
import { POST as logisticsHandler } from '../webhooks/logistics/route'

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const botType = url.searchParams.get('bot')

  if (botType === 'order') {
    return orderHandler(req)
  }
  if (botType === 'payment') {
    return paymentHandler(req)
  }
  if (botType === 'support') {
    return supportHandler(req)
  }
  if (botType === 'logistics') {
    return logisticsHandler(req)
  }

  // Default to Admin Catalog handler
  return adminHandler(req)
}
