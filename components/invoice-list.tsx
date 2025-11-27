"use client"

import { useState } from "react"
import { FileText, Eye, Download, Trash2, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const router = useRouter()
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!invoiceToDelete) return

    setIsDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("invoices").delete().eq("id", invoiceToDelete)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting invoice:", error)
      alert("Failed to delete invoice")
    } finally {
      setIsDeleting(false)
      setInvoiceToDelete(null)
    }
  }

  if (!invoices || invoices.length === 0) {
    // ... empty state ...
  }

  return (
    <>
      <div className="space-y-3">
        {invoices.map((invoice) => {
          const status = statusConfig[invoice.status as keyof typeof statusConfig] || statusConfig.draft
          const StatusIcon = status.icon

          return (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white border border-border/50 hover:border-border transition-all duration-200 hover:shadow-md hover:shadow-black/5 group"
            >
              {/* ... invoice details ... */}
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
                <Button 
                  size="icon-sm" 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                  onClick={() => setInvoiceToDelete(invoice.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <AlertDialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
