import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, FileText, DollarSign, Clock, LogOut, User } from "lucide-react"
import { InvoiceList } from "@/components/invoice-list"
import Image from "next/image"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalInvoices = invoices?.length || 0
  const paidInvoices = invoices?.filter((inv) => inv.status === "paid").length || 0
  const totalRevenue =
    invoices
      ?.filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + Number.parseFloat(inv.total.toString()), 0) || 0
  const pendingInvoices = invoices?.filter((inv) => inv.status === "draft" || inv.status === "sent").length || 0

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold  text-primary tracking-tight">
              <Image src="/logo.png" alt="InvoiceSnap Logo" className="w-8 h-8 rounded-lg object-cover" width={100} height={100} />
              InvoiceSnap
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-border shadow-sm">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{user?.email}</span>
              </div>
              <form action={handleSignOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full px-4"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold  text-primary mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Here's what's happening with your invoices today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Invoices</p>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold  text-primary">{totalInvoices}</p>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Paid Invoices</p>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5 text-green-700" />
              </div>
            </div>
            <p className="text-2xl font-bold  text-primary">{paidInvoices}</p>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</p>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold  text-primary">${totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending</p>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 text-orange-700" />
              </div>
            </div>
            <p className="text-2xl font-bold  text-primary">{pendingInvoices}</p>
          </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-card rounded-3xl border border-border/50 shadow-xl shadow-black/5 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold  text-primary mb-2">Recent Invoices</h2>
              <p className="text-muted-foreground">Manage and track your recent transactions</p>
            </div>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full h-12 px-8 transition-all hover:scale-105"
            >
              <Link href="/create">
                <Plus className="w-5 h-5 mr-2" />
                Create Invoice
              </Link>
            </Button>
          </div>

          <InvoiceList invoices={invoices || []} />
        </div>
      </main>
    </div>
  )
}
