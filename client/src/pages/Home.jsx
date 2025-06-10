import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Lock, Send, Unlock, Sparkles, Shield, Zap, Globe } from "lucide-react"
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
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-200 dark:bg-violet-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Main Card */}
          <div className="glass rounded-2xl shadow-2xl p-8 card-hover animate-slide-up">
            <div className="text-center mb-8">
              {/* Icon */}
              <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center animate-pulse-glow">
                {isPrivate ? (
                  <Lock className="h-8 w-8 text-white" />
                ) : (
                  <Unlock className="h-8 w-8 text-white" />
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-3xl font-bold mb-2 gradient-text">
                Welcome to ClipSync
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Share text snippets instantly across devices with secure, cloud-based clipboard management.
              </p>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-6">
                <div className="flex items-center gap-3">
                  {isPrivate ? (
                    <Shield className="h-5 w-5 text-violet-600" />
                  ) : (
                    <Globe className="h-5 w-5 text-blue-600" />
                  )}
                  <div className="text-left">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {isPrivate ? "Private Clipboard" : "Public Clipboard"}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isPrivate ? "Secured with passcode" : "Open access"}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={isPrivate} 
                  onCheckedChange={() => setIsPrivate(!isPrivate)} 
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter clipboard code (e.g., my-notes)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-12 text-center text-lg font-medium bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl transition-all duration-300"
                  />
                </div>

                {isPrivate && (
                  <div className="relative animate-slide-up">
                    <Input
                      type="password"
                      placeholder="Enter your secure passcode"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full h-12 text-center text-lg font-medium bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl transition-all duration-300"
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl btn-hover-lift transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      <span>Access Clipboard</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Help Text */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {isPrivate 
                    ? "Your clipboard will be protected with end-to-end encryption" 
                    : "Anyone with the code can access this clipboard"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl glass card-hover">
              <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Instant Sync</p>
            </div>
            <div className="text-center p-4 rounded-xl glass card-hover">
              <Shield className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Secure</p>
            </div>
            <div className="text-center p-4 rounded-xl glass card-hover">
              <Globe className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Cross-Device</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}