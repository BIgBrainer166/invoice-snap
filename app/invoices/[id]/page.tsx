import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { InvoiceActions } from "@/components/invoice-actions"
import { cn } from "@/lib/utils"

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch invoice details
  const { data: invoice, error } = await supabase.from("invoices").select("*").eq("id", id).single()

  if (error || !invoice) {
    notFound()
  }

  // Verify ownership (RLS handles this but good for explicit redirect)
  if (invoice.user_id !== user.id) {
    redirect("/dashboard")
  }

  const items = invoice.items as any[]

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-12">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <InvoiceActions invoice={invoice} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Invoice View */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card text-card-foreground rounded-[1.5rem] shadow-xl shadow-black/5 overflow-hidden border border-border/50">
              
              {/* Custom Logo */}
              {invoice.logo_url && (
                <div className={cn("px-8 pt-8 flex", {
                  "justify-start": invoice.logo_position === "left",
                  "justify-center": invoice.logo_position === "center",
                  "justify-end": !invoice.logo_position || invoice.logo_position === "right",
                })}>
                  <img src={invoice.logo_url} alt="Company Logo" className="h-16 object-contain" />
                </div>
              )}

              {/* Invoice Header */}
              <div className={cn("px-8 pb-8 border-b border-border/50", invoice.logo_url ? "pt-6" : "pt-8")}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-1 font-heading">INVOICE</h1>
                    <p className="text-muted-foreground font-mono">#{invoice.invoice_number}</p>
                  </div>
                  <div className="text-right">
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Bill To</h3>
                    <p className="font-semibold text-lg text-foreground">{invoice.client_name}</p>
                    {invoice.client_email && <p className="text-muted-foreground">{invoice.client_email}</p>}
                    {invoice.client_address && (
                      <p className="text-muted-foreground whitespace-pre-wrap mt-1">{invoice.client_address}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="mb-4">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Issue Date</h3>
                      <p className="font-medium text-foreground">{format(new Date(invoice.issue_date), "MMMM do, yyyy")}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Due Date</h3>
                      <p className="font-medium text-foreground">{format(new Date(invoice.due_date), "MMMM do, yyyy")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="p-8">
                <table className="w-full mb-8">
                  <thead>
                    <tr className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                      <th className="text-left py-3">Description</th>
                      <th className="text-right py-3">Qty</th>
                      <th className="text-right py-3">Rate</th>
                      <th className="text-right py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-4 font-medium text-foreground/80">{item.description}</td>
                        <td className="text-right py-4 text-muted-foreground">{item.quantity}</td>
                        <td className="text-right py-4 text-muted-foreground">${Number(item.rate).toFixed(2)}</td>
                        <td className="text-right py-4 font-semibold text-foreground">${Number(item.amount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end border-t border-border/50 pt-8">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${Number(invoice.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax ({invoice.tax_rate}%)</span>
                      <span>${Number(invoice.tax_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t border-border/50">
                      <span>Total</span>
                      <span>${Number(invoice.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="bg-secondary/30 p-8 border-t border-border/50">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Notes</h3>
                  <p className="text-foreground/80 text-sm">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border border-border/50 rounded-[1.5rem] p-6 shadow-lg shadow-black/5">
              <h3 className="text-lg font-bold text-primary mb-4 font-heading">Invoice Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <InvoiceStatusBadge status={invoice.status} />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p className="text-foreground font-medium">{format(new Date(invoice.created_at), "PPP p")}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-foreground font-medium">{format(new Date(invoice.updated_at), "PPP p")}</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary border border-border/50 rounded-[1.5rem] p-6">
              <h3 className="text-lg font-bold text-primary mb-2 font-heading">Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                Send this invoice directly to your client via email to get paid faster. You can also download it as a
                PDF for your records.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
