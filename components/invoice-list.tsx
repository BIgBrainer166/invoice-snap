"use client"

import { FileText, Eye, Download, Trash2, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Invoice {
  id: string
  invoice_number: string
  client_name: string
  total: number
  status: string
  created_at: string
  due_date: string
}

interface InvoiceListProps {
  invoices: Invoice[]
}

const statusConfig = {
  draft: { label: "Draft", color: "text-slate-600 bg-slate-100 border-slate-200", icon: Clock },
  sent: { label: "Sent", color: "text-blue-600 bg-blue-50 border-blue-200", icon: Clock },
  paid: { label: "Paid", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
  overdue: { label: "Overdue", color: "text-red-600 bg-red-50 border-red-200", icon: XCircle },
  cancelled: { label: "Cancelled", color: "text-slate-500 bg-slate-100 border-slate-200", icon: XCircle },
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1 font-heading">No invoices yet</h3>
        <p className="text-muted-foreground font-sans mb-6">Create your first invoice to get started tracking your revenue.</p>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg shadow-primary/20 rounded-full px-6"
        >
          <Link href="/create">Create your first invoice</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => {
        const status = statusConfig[invoice.status as keyof typeof statusConfig] || statusConfig.draft
        const StatusIcon = status.icon

        return (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-border/50 hover:border-border transition-all duration-200 hover:shadow-md hover:shadow-black/5 group"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold font-heading text-foreground truncate">{invoice.invoice_number}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-medium ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-sans truncate">{invoice.client_name}</p>
              </div>

              <div className="hidden md:flex flex-col items-end mr-6">
                <p className="font-bold font-heading text-foreground">
                  ${Number.parseFloat(invoice.total.toString()).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  {formatDistanceToNow(new Date(invoice.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button asChild size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-secondary rounded-full">
                <Link href={`/invoices/${invoice.id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-secondary rounded-full">
                <Download className="w-4 h-4" />
              </Button>
              <Button size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
