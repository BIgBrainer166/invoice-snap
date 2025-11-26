import { Clock, CheckCircle2, XCircle, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface InvoiceStatusBadgeProps {
  status: string
  className?: string
}

const statusConfig = {
  draft: { label: "Draft", color: "text-slate-600 bg-slate-100 border-slate-200", icon: Clock },
  sent: { label: "Sent", color: "text-blue-600 bg-blue-100 border-blue-200", icon: Send },
  paid: { label: "Paid", color: "text-green-600 bg-green-100 border-green-200", icon: CheckCircle2 },
  overdue: { label: "Overdue", color: "text-red-600 bg-red-100 border-red-200", icon: XCircle },
  cancelled: { label: "Cancelled", color: "text-slate-500 bg-slate-100 border-slate-200", icon: XCircle },
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        config.color,
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  )
}
