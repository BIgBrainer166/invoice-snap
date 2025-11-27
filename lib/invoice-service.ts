/**
 * Invoice service using Prisma ORM
 * 
 * This demonstrates type-safe database operations replacing raw SQL queries.
 * Import and use these functions in your pages instead of direct Supabase queries.
 */

import { prisma } from './prisma'
import type { Invoice, InvoiceStatus } from '@prisma/client'

/**
 * Get all invoices for a user
 */
export async function getUserInvoices(userId: string) {
  return prisma.invoice.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
}

/**
 * Get a single invoice by ID
 */
export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id }
  })
}

/**
 * Create a new invoice
 */
export async function createInvoice(data: {
  userId: string
  invoiceNumber: string
  clientName: string
  clientEmail?: string
  clientAddress?: string
  issueDate: Date
  dueDate: Date
  items: any[]
  subtotal: number
  taxRate?: number
  taxAmount?: number
  total: number
  notes?: string
  status?: InvoiceStatus
  logoUrl?: string
  logoPosition?: string
}) {
  return prisma.invoice.create({
    data: {
      ...data,
      taxRate: data.taxRate || 0,
      taxAmount: data.taxAmount || 0,
      status: data.status || 'draft'
    }
  })
}

/**
 * Update an invoice
 */
export async function updateInvoice(id: string, data: Partial<Invoice>) {
  return prisma.invoice.update({
    where: { id },
    data
  })
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  return prisma.invoice.update({
    where: { id },
    data: { status }
  })
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(id: string) {
  return prisma.invoice.delete({
    where: { id }
  })
}

/**
 * Get invoice statistics for a user
 */
export async function getInvoiceStats(userId: string) {
  const [total, paid, draft, sent, overdue] = await Promise.all([
    prisma.invoice.count({ where: { userId } }),
    prisma.invoice.count({ where: { userId, status: 'paid' } }),
    prisma.invoice.count({ where: { userId, status: 'draft' } }),
    prisma.invoice.count({ where: { userId, status: 'sent' } }),
    prisma.invoice.count({ where: { userId, status: 'overdue' } })
  ])

  const revenue = await prisma.invoice.aggregate({
    where: { userId, status: 'paid' },
    _sum: { total: true }
  })

  const pending = await prisma.invoice.aggregate({
    where: {
      userId,
      status: { in: ['draft', 'sent', 'overdue'] }
    },
    _sum: { total: true }
  })

  return {
    totalInvoices: total,
    paidInvoices: paid,
    draftInvoices: draft,
    sentInvoices: sent,
    overdueInvoices: overdue,
    totalRevenue: revenue._sum.total || 0,
    pendingAmount: pending._sum.total || 0
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  return prisma.profile.findUnique({
    where: { userId }
  })
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(userId: string, data: {
  fullName?: string
  company?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  logoUrl?: string
}) {
  return prisma.profile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data
  })
}
