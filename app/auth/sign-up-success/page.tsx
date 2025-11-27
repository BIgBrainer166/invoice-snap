import Link from "next/link"
import { CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-secondary/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary/50 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold font-heading text-foreground mb-2">
            <div className="bg-none flex items-center justify-center">
               <img src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
            InvoiceSnap
          </Link>
        </div>

        {/* Success Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 p-8 shadow-2xl shadow-slate-200/50 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold font-heading text-foreground mb-3">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We've sent you a confirmation link. Please check your inbox and click the link to verify your account before
            signing in.
          </p>

          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <Link href="/auth/login">Back to Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
