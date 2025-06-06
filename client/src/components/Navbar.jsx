import { Button } from "@/components/ui/button"
import { Clipboard, Home, Github, Star } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function Navbar() {
    const location = useLocation()
    const isHome = location.pathname === "/"

    return (
        <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-900/80">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-lg">
                            <Clipboard className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            ClipSync
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                            Share anywhere
                        </span>
                    </div>
                </Link>
                
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        asChild
                    >
                        <a href="https://github.com/Yagna123k/Online-Clipboard" target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            <span>Star on GitHub</span>
                            <Star className="h-3 w-3 fill-current" />
                        </a>
                    </Button>
                    
                    {!isHome && (
                        <Button variant="outline" size="sm" className="btn-hover-lift" asChild>
                            <Link to="/" className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}