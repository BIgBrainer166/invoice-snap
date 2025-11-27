"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

// Types for our form state
interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceForm {
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientAddress: string
  issueDate: Date
  dueDate: Date
  items: InvoiceItem[]
  notes: string
  taxRate: number
  logoUrl: string | null
  logoPosition: "left" | "right" | "center"
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<InvoiceForm>({
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
    items: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
    taxRate: 0,
    logoUrl: null,
    logoPosition: "right",
  })

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = (subtotal * formData.taxRate) / 100
  const total = subtotal + taxAmount

  const handleInputChange = (field: keyof InvoiceForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        handleInputChange("logoUrl", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          // Recalculate amount if quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }
          return updatedItem
        }
        return item
      }),
    }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Math.random().toString(36).substr(2, 9),
          description: "",
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    }))
  }

  const removeItem = (id: string) => {
    if (formData.items.length === 1) return
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Check for duplicate invoice number
      const { data: existingInvoice } = await supabase
        .from("invoices")
        .select("id")
        .eq("user_id", user.id)
        .eq("invoice_number", formData.invoiceNumber)
        .single()

      if (existingInvoice) {
        throw new Error("Invoice number already exists. Please use a different number.")
      }

      const { error } = await supabase.from("invoices").insert({
        user_id: user.id,
        invoice_number: formData.invoiceNumber,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_address: formData.clientAddress,
        issue_date: formData.issueDate,
        due_date: formData.dueDate,
        items: formData.items,
        subtotal,
        tax_rate: formData.taxRate,
        tax_amount: taxAmount,
        total,
        notes: formData.notes,
        status: "draft",
        // Note: These columns must exist in your Supabase 'invoices' table
        logo_url: formData.logoUrl,
        logo_position: formData.logoPosition,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating invoice:", error)
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-12">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-primary transition-colors font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Step {step} of 3</span>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold font-heading text-primary mb-2">Client & Branding</h1>
              <p className="text-muted-foreground font-sans text-lg">Add your logo and client details</p>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl shadow-black/5 space-y-6">
              {/* Branding Section */}
              <div className="p-6 bg-secondary/30 rounded-xl border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-heading text-primary">Company Logo</Label>
                  {formData.logoUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInputChange("logoUrl", null)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2 bg-background">
                        {formData.logoUrl ? (
                          <img src={formData.logoUrl} alt="Logo preview" className="max-h-24 object-contain" />
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                              <Plus className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Click to upload logo</span>
                            <span className="text-xs text-muted-foreground/70">PNG, JPG up to 2MB</span>
                          </>
                        )}
                      </div>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </Label>
                  </div>

                  <div className="space-y-4">
                    <Label>Logo Position</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["left", "center", "right"].map((pos) => (
                        <button
                          key={pos}
                          onClick={() => handleInputChange("logoPosition", pos)}
                          className={cn(
                            "px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize",
                            formData.logoPosition === pos
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Choose where your logo appears on the invoice header.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Invoice Number</Label>
                  <Input
                    value={formData.invoiceNumber}
                    onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                    className="bg-background border-border focus:border-primary focus:ring-primary/20 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Client Name</Label>
                  <Input
                    placeholder="e.g. Acme Corp"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    className="bg-background border-border focus:border-primary focus:ring-primary/20 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Client Email</Label>
                <Input
                  type="email"
                  placeholder="billing@acme.com"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                  className="bg-background border-border focus:border-primary focus:ring-primary/20 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Client Address</Label>
                <Textarea
                  placeholder="123 Business St..."
                  value={formData.clientAddress}
                  onChange={(e) => handleInputChange("clientAddress", e.target.value)}
                  className="bg-background border-border focus:border-primary focus:ring-primary/20 min-h-[100px] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-border rounded-xl hover:bg-secondary",
                          !formData.issueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.issueDate ? format(formData.issueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border shadow-xl rounded-xl">
                      <Calendar
                        mode="single"
                        selected={formData.issueDate}
                        onSelect={(date) => date && handleInputChange("issueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-border rounded-xl hover:bg-secondary",
                          !formData.dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border shadow-xl rounded-xl">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => date && handleInputChange("dueDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.clientName}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full px-8 h-12 text-lg"
              >
                Next: Add Items <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold font-heading text-primary mb-2">Line Items</h1>
              <p className="text-muted-foreground font-sans text-lg">Add the services or products you're billing for</p>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl shadow-black/5 space-y-6">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 items-end pb-6 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="col-span-12 md:col-span-6 space-y-2">
                    <Label className="text-foreground">Description</Label>
                    <Input
                      placeholder="Service or product name"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                      className="bg-background border-border focus:border-primary focus:ring-primary/20 rounded-xl"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <Label className="text-foreground">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                      className="bg-background border-border focus:border-primary focus:ring-primary/20 rounded-xl"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 space-y-2">
                    <Label className="text-foreground">Rate</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                      className="bg-background border-border focus:border-primary focus:ring-primary/20 rounded-xl"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-1 space-y-2">
                    <Label className="text-foreground">Amount</Label>
                    <div className="h-10 flex items-center text-muted-foreground font-mono font-medium">${item.amount.toFixed(2)}</div>
                  </div>
                  <div className="col-span-1 flex justify-center pb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addItem}
                className="w-full border-dashed border-border hover:border-primary hover:text-primary hover:bg-secondary rounded-xl h-12"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>

              <div className="pt-6 border-t border-border/50 flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-muted-foreground">Tax Rate (%):</span>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange("taxRate", Number.parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 bg-background border-border text-right rounded-lg"
                    />
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax Amount:</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-foreground pt-3 border-t border-border/50">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full px-8 h-12 text-lg">
                Next: Review <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold font-heading text-primary mb-2">Review & Create</h1>
              <p className="text-muted-foreground font-sans text-lg">Check the details before generating the invoice</p>
            </div>

            <div className="bg-card text-card-foreground rounded-3xl p-8 shadow-xl shadow-black/5 border border-border/50">
              {/* Logo Preview in Review Step */}
              {formData.logoUrl && (
                <div className={cn("mb-8 flex", {
                  "justify-start": formData.logoPosition === "left",
                  "justify-center": formData.logoPosition === "center",
                  "justify-end": formData.logoPosition === "right",
                })}>
                  <img src={formData.logoUrl} alt="Company Logo" className="h-16 object-contain" />
                </div>
              )}

              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary font-heading">INVOICE</h2>
                  <p className="text-muted-foreground">#{formData.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-foreground">Bill To:</h3>
                  <p className="text-foreground/80">{formData.clientName}</p>
                  <p className="text-muted-foreground">{formData.clientEmail}</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{formData.clientAddress}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-muted-foreground text-sm uppercase tracking-wider">Issue Date</h3>
                  <p className="font-medium text-foreground">{format(formData.issueDate, "MMMM do, yyyy")}</p>
                </div>
                <div>
                  <h3 className="font-bold text-muted-foreground text-sm uppercase tracking-wider">Due Date</h3>
                  <p className="font-medium text-foreground">{format(formData.dueDate, "MMMM do, yyyy")}</p>
                </div>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-primary/10 text-primary">
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-right py-3 font-semibold">Qty</th>
                    <th className="text-right py-3 font-semibold">Rate</th>
                    <th className="text-right py-3 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item) => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-3 text-foreground/80">{item.description || "Item"}</td>
                      <td className="text-right py-3 text-muted-foreground">{item.quantity}</td>
                      <td className="text-right py-3 text-muted-foreground">${item.rate.toFixed(2)}</td>
                      <td className="text-right py-3 font-medium text-foreground">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax ({formData.taxRate}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t border-border/50">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {formData.notes && (
                <div className="bg-secondary/50 p-6 rounded-xl border border-border/50">
                  <h3 className="font-bold text-muted-foreground text-sm uppercase mb-2 tracking-wider">Notes</h3>
                  <p className="text-sm text-foreground/80">{formData.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Add Notes (Optional)</Label>
                <Textarea
                  placeholder="Payment terms, thank you note, etc."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="bg-background border-border focus:border-primary focus:ring-primary/20 rounded-xl"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[150px] shadow-lg shadow-green-600/20 rounded-full h-12 px-8"
                >
                  {isLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Create Invoice
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
