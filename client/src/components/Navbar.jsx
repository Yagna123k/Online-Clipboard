import { Button } from "@/components/ui/button"
import { Clipboard, Home, Search } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function Navbar(props) {
    const location = useLocation()
    const isHome = location.pathname === "/"
    const isClipboard = location.pathname.startsWith("/clipboard")

    const [searchParams, setSearchParams] = useSearchParams();
    const initial = searchParams.get("q") || "";
    const [query, setQuery] = useState(initial);
    const debounceRef = useRef(null);

    useEffect(() => {
        setQuery(initial);
    }, [initial]);

    const onSearchChange = (e) => {
        const val = e.target.value;
        setQuery(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (val && val.trim() !== "") {
                setSearchParams({ q: val.trim() });
            } else {
                setSearchParams({});
            }
        }, 300);
    };

    return (
        <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="container flex h-16 items-center">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <Clipboard className="h-6 w-6" />
                        <span className="text-xl font-bold">ClipSync</span>
                    </Link>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-3">
                    {isClipboard && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 pointer-events-none" />
                            <input
                                type="search"
                                value={query}
                                onChange={onSearchChange}
                                placeholder="Search clipboard..."
                                className="w-55 pl-10 pr-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                aria-label="Search clipboard"
                            />
                        </div>
                    )}

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

export default Navbar