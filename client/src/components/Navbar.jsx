import { Button } from "@/components/ui/button"
import { Clipboard, Home, Github, Star } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function Navbar() {
    const location = useLocation()
    const isHome = location.pathname === "/"

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 premium-glass">
            <div className="container flex h-20 items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <div className="absolute inset-0 classic-gradient rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                        <div className="relative classic-gradient p-3 rounded-2xl shadow-lg">
                            <Clipboard className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold classic-heading premium-text-gradient">
                            ClipSync
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                            Premium Clipboard
                        </span>
                    </div>
                </Link>
                
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hidden sm:flex items-center gap-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium"
                        asChild
                    >
                        <a href="https://github.com/Yagna123k/Online-Clipboard" target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            <span>Star on GitHub</span>
                            <Star className="h-3 w-3 fill-current text-amber-500" />
                        </a>
                    </Button>
                    
                    {!isHome && (
                        <Button variant="outline" size="sm" className="premium-btn-hover font-medium" asChild>
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