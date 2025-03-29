import { Button } from "@/components/ui/button"
import { Clipboard, Home } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function Navbar() {
    const location = useLocation()
    const isHome = location.pathname === "/"

    return (
        <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Clipboard className="h-6 w-6" />
                    <span className="text-xl font-bold">ClipSync</span>
                </Link>
                <div className="flex items-center gap-4">
                    {!isHome && (
                        <Button variant="outline" size="sm" asChild>
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