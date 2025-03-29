import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Clipboard, Send, SendHorizontal } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import axios from "axios"

export default function Home() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid clipboard code.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/clipboard/go`, { code })

      if (response.status === 200 || response.status === 201) {
        navigate(`/clipboard/${code}`)
      } else {
        throw new Error("Failed to access clipboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access clipboard. Please try again.",
        variant: "destructive",
      })
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-300 shadow-sm">
          <div className="text-center p-6">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-black/10 flex items-center justify-center">
              <Clipboard className="h-6 w-6 text-black dark:text-black" />
            </div>
            <h2 className="text-2xl font-bold mb-1">ClipSync</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your clipboard code to access your shared content
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Enter clipboard code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="sr-only">Loading...</span>
                    </span>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Enter an existing code or create a new one
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
