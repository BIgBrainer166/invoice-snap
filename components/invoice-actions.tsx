"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Download, Send, Printer, MoreVertical, CheckCircle2, XCircle, Trash2, Clock } from "lucide-react"

interface InvoiceActionsProps {
  invoice: any
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const updateStatus = async (status: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("invoices").update({ status }).eq("id", invoice.id)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteInvoice = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("invoices").delete().eq("id", invoice.id)

      if (error) throw error
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting invoice:", error)
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden sm:flex border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
        onClick={handlePrint}
      >
        <Printer className="w-4 h-4 mr-2" />
        Print
      </Button>

      {invoice.status !== "paid" && (
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => updateStatus("sent")}
          disabled={isLoading || invoice.status === "sent"}
        >
          <Send className="w-4 h-4 mr-2" />
          Mark Sent
        </Button>
      )}

      {invoice.status !== "paid" && (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => updateStatus("paid")}
          disabled={isLoading}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark Paid
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
          <DropdownMenuItem onClick={handlePrint} className="cursor-pointer focus:bg-slate-800 focus:text-white">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-800" />
          <DropdownMenuItem
            onClick={() => updateStatus("draft")}
            className="cursor-pointer focus:bg-slate-800 focus:text-white"
          >
            <Clock className="w-4 h-4 mr-2" /> Mark as Draft
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateStatus("overdue")}
            className="cursor-pointer focus:bg-slate-800 focus:text-white text-orange-400 "
          >
            <XCircle className="w-4 h-4 mr-2" /> Mark as Overdue
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateStatus("cancelled")}
            className="cursor-pointer focus:bg-slate-800 focus:text-white text-slate-400"
          >
            <XCircle className="w-4 h-4 mr-2" /> Mark as Cancelled
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-800" />
          <DropdownMenuItem
            onClick={deleteInvoice}
            className="cursor-pointer focus:bg-red-900/20 focus:text-red-400 text-red-400"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
