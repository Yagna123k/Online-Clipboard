import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Lock, Send, Unlock } from "lucide-react"
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-300 shadow-sm p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-black/10 flex items-center justify-center">
              {isPrivate ? <Lock className="h-6 w-6 text-black dark:text-white" /> : <Unlock className="h-6 w-6 text-black dark:text-white" />}
            </div>
            <h2 className="text-2xl font-bold mb-1">ClipSync</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your clipboard code to access or create a clipboard.
            </p>

            {/* Toggle between Public & Private */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Private Clipboard</span>
              <Switch checked={isPrivate} onCheckedChange={() => setIsPrivate(!isPrivate)} />
            </div>

            {/* Clipboard Code Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter clipboard code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full"
              />

              {/* Passcode Input (only for Private clipboard) */}
              {isPrivate && (
                <Input
                  type="password"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full"
                />
              )}

              <Button type="submit" disabled={isLoading} className="w-full flex items-center justify-center">
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="sr-only">Loading...</span>
                  </span>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Continue
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {isPrivate ? "Enter a passcode to secure your clipboard." : "Public clipboards don't require a passcode."}
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
