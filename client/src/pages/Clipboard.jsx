import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Check, Loader2, Copy, Trash2, FileText, Clock, Sparkles, Crown, Star } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import axios from "axios"

export default function Clipboard() {
    const { code } = useParams()
    const [items, setItems] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [clipboardExists, setClipboardExists] = useState(true)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        if (!code) return

        const fetchItems = async () => {
            setLoading(true)

            try {
                const storedPasscode = localStorage.getItem(`clipboard_passcode_${code}`)

                const response = await axios.post(`${import.meta.env.VITE_API}/clipboard/${code}`, {
                    passcode: storedPasscode || undefined
                })

                if (response.status === 200) {
                    setItems(response.data.items || [])
                    setClipboardExists(true)
                }
            } catch (error) {
                console.error("Error fetching clipboard items:", error)
                setClipboardExists(false)
            } finally {
                setLoading(false)
            }
        }

        fetchItems()
    }, [code])

    const addItem = async () => {
        if (!text.trim() || !title.trim()) {
            toast({
                title: "Error",
                description: "Title and text cannot be empty!",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        const newItem = { title, text }

        try {
            const storedPasscode = localStorage.getItem(`clipboard_passcode_${code}`)

            const response = await axios.post(`${import.meta.env.VITE_API}/clipboard/add-item`, {
                code,
                item: newItem,
                passcode: storedPasscode || undefined
            })

            if (response.status === 200 || response.status === 201) {
                setItems(response.data.items || [])
                setShowModal(false)
                setTitle("")
                setText("")
                toast({
                    title: "Success",
                    description: "Item added to clipboard",
                    variant: "success"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item. Please try again.",
                variant: "destructive",
            })
            console.error("Error adding item:", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteItem = async (itemIndex) => {
        if (!code || typeof itemIndex !== 'number') return;
    
        setLoading(true);
    
        try {
            const storedPasscode = localStorage.getItem(`clipboard_passcode_${code}`);
            const url = `${import.meta.env.VITE_API}/clipboard/delete-item`;
    
            const response = await axios.delete(url, {
                params: {
                    code,
                    itemIndex,
                    passcode: storedPasscode || undefined,
                },
            });
    
            if (response.status === 200) {
                setItems(response.data.items || []);
                toast({
                    title: "Deleted",
                    description: "Item successfully deleted.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete item. Please try again.",
                variant: "destructive",
            });
            console.error("Error deleting item:", error);
        } finally {
            setLoading(false);
        }
    };        

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1 container py-10 relative">
                {/* Premium background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-900/15 dark:to-indigo-900/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-elegant-float"></div>
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-900/15 dark:to-pink-900/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-elegant-float" style={{animationDelay: '1s'}}></div>
                </div>

                {/* Premium Header */}
                <div className="relative z-10 mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-3xl classic-gradient shadow-2xl">
                                <FileText className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 classic-heading mb-2">
                                    Premium Clipboard
                                </h1>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="px-4 py-2 text-sm font-semibold classic-gradient text-white rounded-full shadow-lg">
                                        {code}
                                    </span>
                                    <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 premium-body">
                                        <Clock className="h-4 w-4" />
                                        {items.length} premium items
                                    </span>
                                    <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                                        <Crown className="h-4 w-4" />
                                        <span className="font-medium">Premium</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {clipboardExists && (
                            <Button
                                onClick={() => setShowModal(true)}
                                variant="primary"
                                size="lg"
                                className="premium-btn-hover shadow-2xl"
                            >
                                <Plus className="mr-3 h-5 w-5" />
                                Add Premium Item
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {loading ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="premium-glass rounded-3xl p-8 animate-pulse">
                                    <div className="premium-skeleton h-6 w-3/4 rounded-xl mb-6"></div>
                                    <div className="premium-skeleton h-4 w-full rounded-lg mb-3"></div>
                                    <div className="premium-skeleton h-4 w-2/3 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : clipboardExists ? (
                        <>
                            {items.length > 0 ? (
                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {items.map((item, index) => (
                                        <ClipboardItem 
                                            key={index} 
                                            index={index} 
                                            item={item} 
                                            toast={toast} 
                                            onDelete={deleteItem} 
                                        />
                                    )).reverse()}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="mx-auto mb-8 h-24 w-24 rounded-3xl luxury-gradient flex items-center justify-center shadow-2xl animate-premium-glow">
                                        <Sparkles className="h-12 w-12 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 classic-heading">
                                        Your premium clipboard awaits
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto premium-body text-lg leading-relaxed">
                                        Start by adding your first premium text snippet. Perfect for sharing code, 
                                        notes, or any content with sophisticated style and security.
                                    </p>
                                    <Button 
                                        onClick={() => setShowModal(true)}
                                        variant="luxury"
                                        size="lg"
                                        className="premium-btn-hover shadow-2xl"
                                    >
                                        <Plus className="mr-3 h-5 w-5" />
                                        Add Your First Premium Item
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="mx-auto mb-8 h-24 w-24 rounded-3xl bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 flex items-center justify-center shadow-2xl">
                                <X className="h-12 w-12 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4 classic-heading">
                                Clipboard not found
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto premium-body text-lg">
                                The premium clipboard code you entered doesn't exist. Please verify the code and try again.
                            </p>
                        </div>
                    )}
                </div>

                {/* Premium Floating Add Button */}
                {clipboardExists && items.length > 0 && (
                    <Button
                        onClick={() => setShowModal(true)}
                        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl luxury-gradient hover:shadow-3xl text-white premium-btn-hover z-50"
                        size="icon"
                    >
                        <Plus className="h-7 w-7" />
                    </Button>
                )}

                {/* Premium Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-6">
                        <div className="premium-glass rounded-3xl shadow-2xl w-full max-w-2xl animate-sophisticated-slide-up">
                            <div className="p-8">
                                {/* Premium Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl luxury-gradient shadow-lg">
                                            <Plus className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 classic-heading">
                                                Add Premium Item
                                            </h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 premium-body">
                                                Create a new premium clipboard entry
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-3 rounded-2xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 premium-btn-hover"
                                        disabled={loading}
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Premium Form */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 classic-heading">
                                            Premium Title
                                        </label>
                                        <Input
                                            placeholder="Enter a sophisticated title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={loading}
                                            className="h-14 bg-white/70 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 classic-heading">
                                            Premium Content
                                        </label>
                                        <Textarea
                                            placeholder="Paste or type your premium content here..."
                                            className="min-h-[180px] bg-white/70 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl resize-none text-base leading-relaxed"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Premium Actions */}
                                <div className="flex justify-end gap-4 mt-8">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowModal(false)} 
                                        disabled={loading}
                                        size="lg"
                                        className="px-8 premium-btn-hover"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={addItem} 
                                        disabled={loading}
                                        variant="luxury"
                                        size="lg"
                                        className="px-8 premium-btn-hover shadow-xl"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                <span>Adding...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <Plus className="h-5 w-5" />
                                                <span>Add Premium Item</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

function ClipboardItem({ item, toast, onDelete, index }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(item.text)
        setCopied(true)
        toast({
            title: "Copied!",
            description: "Premium content copied to your clipboard.",
            variant: "success",
            duration: 2000,
        })
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="premium-glass rounded-3xl shadow-xl premium-card-hover animate-sophisticated-slide-up border border-slate-200/50 dark:border-slate-700/50">
            <div className="p-8">
                {/* Premium Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 shadow-sm">
                            <Star className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 classic-heading mb-1">
                                {item.title}
                            </h3>
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Premium Item</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                        <button
                            className="p-3 rounded-2xl bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-900/40 transition-all duration-300 premium-btn-hover shadow-sm hover:shadow-md"
                            onClick={() => onDelete(index)}
                            title="Delete premium item"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                            className={`p-3 rounded-2xl transition-all duration-300 premium-btn-hover shadow-sm hover:shadow-md ${
                                copied 
                                    ? "bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" 
                                    : "bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800"
                            }`}
                            onClick={handleCopy}
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Premium Content */}
                <div className="relative mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed premium-body">
                        {item.text}
                    </p>
                    {item.text.length > 150 && (
                        <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white dark:from-slate-800 to-transparent pl-12 text-xs text-slate-500 dark:text-slate-400">
                            ...
                        </div>
                    )}
                </div>

                {/* Premium Footer */}
                <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-2 premium-body">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            {item.text.length} characters
                        </span>
                        <span className="flex items-center gap-2 premium-body">
                            <Clock className="h-3 w-3" />
                            Just now
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}