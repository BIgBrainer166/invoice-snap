"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Clock, FileText, Send, User, Sparkles, Stars, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Image src="/logo.png" alt="InvoiceSnap Logo" className="w-8 h-8 rounded-lg object-cover" width={100} height={100} />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight">InvoiceSnap</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            {/* <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link> */}
            <Button
              className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20"
              onClick={() => router.push("/auth/login")}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Stars className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">The new standard for freelancers</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-heading tracking-tight text-primary leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
              Invoicing, <br />
              <span className="italic font-serif text-muted-foreground">Reimagined.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
              Create professional, stunning invoices in seconds. No spreadsheets, no confusion. Just you, getting paid.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              <Button
                size="lg"
                className="rounded-full px-10 h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/20"
                onClick={() => router.push("/auth/login")}
              >
                Start Invoicing Free <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
            </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-linear-to-b from-secondary/50 to-transparent rounded-full blur-3xl -z-10 opacity-60" />
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="mb-16 md:mb-24 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 text-primary">
              Everything you need. <br />
              <span className="text-muted-foreground italic">Nothing you don't.</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              We stripped away the complexity of traditional accounting software to build something you'll actually enjoy using.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[400px]">
            {/* Large Card 1 */}
            <Card className="md:col-span-2 bg-white border-border/50 shadow-xl shadow-black/5 rounded-4xl overflow-hidden group hover:shadow-2xl hover:shadow-black/10 transition-all duration-500">
              <div className="h-full flex flex-col p-10 relative">
                <div className="z-10">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Image src="/logo.png" alt="InvoiceSnap Logo" className="w-8 h-8 rounded-lg object-cover" width={100} height={100} />
                  </div>
                  <h3 className="text-3xl font-bold font-heading mb-4">Lightning Fast</h3>
                  <p className="text-lg text-muted-foreground max-w-md">
                    From blank page to sent invoice in under 90 seconds. Smart defaults and auto-calculations mean you never have to do math again.
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-linear-to-tl from-secondary to-transparent rounded-tl-[4rem] opacity-50 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute right-10 bottom-10 bg-white p-6 rounded-xl shadow-lg border border-border/50 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Link href="/" className="flex items-center gap-2 text-xl font-bold font-heading text-primary tracking-tight">
                    <Image src="/logo.png" alt="InvoiceSnap Logo" className="w-8 h-8 rounded-lg object-cover" width={100} height={100} />
                    InvoiceSnap
                  </Link>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Invoice Sent</div>
                      <div className="text-xs text-muted-foreground">Just now</div>
                    </div>
                  </div>
                  <div className="h-2 w-32 bg-secondary rounded-full mt-4" />
                </div>
              </div>
            </Card>

            {/* Tall Card 2 */}
            <Card className="md:row-span-2 bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 rounded-4xl overflow-hidden group hover:scale-[1.02] transition-all duration-500">
              <div className="h-full flex flex-col p-10 relative">
                <div className="z-10">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold font-heading mb-4">Beautiful Templates</h3>
                  <p className="text-lg text-white/70">
                    Stand out with invoices that look like they were designed by an agency. Clean, professional, and on-brand.
                  </p>
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center pb-10">
                   <div className="w-48 h-64 bg-white rounded-t-2xl shadow-2xl opacity-90 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" />
                </div>
              </div>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white border-border/50 shadow-xl shadow-black/5 rounded-4xl overflow-hidden group hover:shadow-2xl hover:shadow-black/10 transition-all duration-500">
              <div className="h-full flex flex-col p-10">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-3">Instant Delivery</h3>
                <p className="text-muted-foreground">
                  Send via email or download PDF with one click. Track when clients view your invoice.
                </p>
              </div>
            </Card>

            {/* Card 4 */}
            <Card className="bg-white border-border/50 shadow-xl shadow-black/5 rounded-4xl overflow-hidden group hover:shadow-2xl hover:shadow-black/10 transition-all duration-500">
              <div className="h-full flex flex-col p-10">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-3">Client Management</h3>
                <p className="text-muted-foreground">
                  Save client details for next time. Auto-fill addresses and emails instantly.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      {/* <section className="py-20 bg-white border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-12">Trusted by 10,000+ Freelancers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"> */}
             {/* Placeholders for logos - using text for now but styled like logos */}
             {/* <div className="flex items-center justify-center text-2xl font-bold font-heading">Acme Corp</div>
             <div className="flex items-center justify-center text-2xl font-bold font-heading">GlobalTech</div>
             <div className="flex items-center justify-center text-2xl font-bold font-heading">Nebula</div>
             <div className="flex items-center justify-center text-2xl font-bold font-heading">FoxRun</div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-bold font-heading mb-8 tracking-tight">
            Ready to get paid?
          </h2>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-12">
            Join thousands of freelancers who have switched to the simplest invoicing tool on the planet.
          </p>
          <Button
            onClick={() => router.push("/auth/login")}
            size="lg"
            className="rounded-full px-12 h-16 text-xl bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Start For Free
          </Button>
          <p className="mt-8 text-sm text-white/50">No credit card required • Cancel anytime</p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full  opacity-10 mix-blend-overlay" />
      </section>

      {/* Footer */}
      <footer className="bg-background py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Image src="/logo.png" alt="InvoiceSnap Logo" className="w-8 h-8 rounded-lg object-cover" width={100} height={100} />
              </div>
              <span className="text-xl font-bold font-heading">InvoiceSnap</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 InvoiceSnap Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
