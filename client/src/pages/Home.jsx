import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Lock, Send, Unlock, Sparkles, Shield, Zap, Globe, Crown } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import axios from "axios"

export default function Home() {
  const [code, setCode] = useState("")
  const [passcode, setPasscode] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Clipboard code is required.",
        variant: "destructive",
      })
      return
    }

    if (isPrivate && !passcode.trim()) {
      toast({
        title: "Error",
        description: "Passcode is required for private clipboards.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/clipboard/go`, {
        code,
        isPrivate,
        passcode: isPrivate ? passcode : undefined
      })

      if (response.data.error) {
        toast({ title: "Error", description: response.data.error, variant: "destructive" })
      } else {
        toast({ title: "Success", description: "Clipboard accessed successfully!", variant: "success" })

        if (isPrivate) {
          localStorage.setItem(`clipboard_passcode_${code}`, passcode)
        }

        navigate(`/clipboard/${code}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to access clipboard. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Premium background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-elegant-float"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/40 to-pink-200/40 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-elegant-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 dark:from-cyan-900/15 dark:to-blue-900/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-elegant-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="w-full max-w-lg relative z-10">
          {/* Main Card */}
          <div className="premium-glass rounded-3xl shadow-2xl p-10 premium-card-hover animate-sophisticated-slide-up">
            <div className="text-center mb-10">
              {/* Premium Icon */}
              <div className="mx-auto mb-8 h-20 w-20 rounded-3xl classic-gradient flex items-center justify-center animate-premium-glow shadow-2xl">
                {isPrivate ? (
                  <Lock className="h-10 w-10 text-white" />
                ) : (
                  <Crown className="h-10 w-10 text-white" />
                )}
              </div>
              
              {/* Premium Title */}
              <h1 className="text-4xl font-bold mb-3 classic-heading premium-text-gradient">
                Welcome to ClipSync
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed premium-body text-lg">
                Experience premium clipboard management with sophisticated design, 
                secure sharing, and seamless synchronization across all your devices.
              </p>

              {/* Premium Privacy Toggle */}
              <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-700/80 mb-8 border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isPrivate ? 'bg-gradient-to-r from-slate-700 to-slate-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} shadow-lg`}>
                    {isPrivate ? (
                      <Shield className="h-5 w-5 text-white" />
                    ) : (
                      <Globe className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="text-base font-semibold text-slate-900 dark:text-slate-100 classic-heading">
                      {isPrivate ? "Private Clipboard" : "Public Clipboard"}
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 premium-body">
                      {isPrivate ? "Enterprise-grade security" : "Open collaboration"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={isPrivate} 
                  onCheckedChange={() => setIsPrivate(!isPrivate)} 
                />
              </div>

              {/* Premium Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your clipboard code (e.g., my-premium-notes)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-14 text-center text-lg font-medium bg-white/70 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl transition-all duration-400 shadow-lg hover:shadow-xl"
                  />
                </div>

                {isPrivate && (
                  <div className="relative animate-sophisticated-slide-up">
                    <Input
                      type="password"
                      placeholder="Enter your secure passcode"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full h-14 text-center text-lg font-medium bg-white/70 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl transition-all duration-400 shadow-lg hover:shadow-xl"
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  variant="primary"
                  size="lg"
                  className="w-full text-lg font-semibold transition-all duration-400 shadow-xl hover:shadow-2xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="h-5 w-5" />
                      <span>Access Premium Clipboard</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Premium Help Text */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-3 premium-body">
                  <Sparkles className="h-5 w-5 flex-shrink-0" />
                  <span>
                    {isPrivate 
                      ? "Your clipboard will be protected with military-grade encryption and premium security features" 
                      : "Enjoy seamless collaboration with our premium public clipboard experience"
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl premium-glass premium-card-hover">
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 classic-heading">Lightning Fast</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 premium-body">Instant sync</p>
            </div>
            <div className="text-center p-6 rounded-2xl premium-glass premium-card-hover">
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 classic-heading">Ultra Secure</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 premium-body">Bank-grade</p>
            </div>
            <div className="text-center p-6 rounded-2xl premium-glass premium-card-hover">
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 classic-heading">Universal</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 premium-body">All devices</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}