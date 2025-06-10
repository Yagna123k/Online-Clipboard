import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Check, Loader2, Copy, Trash2, FileText, Clock, Sparkles } from "lucide-react"
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
            
            <main className="flex-1 container py-8 relative">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-violet-200 dark:bg-violet-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-float"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
                </div>

                {/* Header */}
                <div className="relative z-10 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Clipboard
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full">
                                        {code}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="h-3 w-3" />
                                        {items.length} items
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {clipboardExists && (
                            <Button
                                onClick={() => setShowModal(true)}
                                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white btn-hover-lift"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                                    <div className="skeleton h-6 w-3/4 rounded mb-4"></div>
                                    <div className="skeleton h-4 w-full rounded mb-2"></div>
                                    <div className="skeleton h-4 w-2/3 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : clipboardExists ? (
                        <>
                            {items.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                                <div className="text-center py-16">
                                    <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                                        <Sparkles className="h-10 w-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        Your clipboard is empty
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                        Start by adding your first text snippet. Perfect for sharing code, notes, or any text across devices.
                                    </p>
                                    <Button 
                                        onClick={() => setShowModal(true)}
                                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white btn-hover-lift"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Item
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                <X className="h-10 w-10 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                                Clipboard not found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                The clipboard code you entered doesn't exist. Please check the code and try again.
                            </p>
                        </div>
                    )}
                </div>

                {/* Floating Add Button */}
                {clipboardExists && items.length > 0 && (
                    <Button
                        onClick={() => setShowModal(true)}
                        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white btn-hover-lift z-50"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
                        <div className="glass rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600">
                                            <Plus className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            Add New Item
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        disabled={loading}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Title
                                        </label>
                                        <Input
                                            placeholder="Enter a descriptive title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={loading}
                                            className="h-12 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Content
                                        </label>
                                        <Textarea
                                            placeholder="Paste or type your content here..."
                                            className="min-h-[150px] bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl resize-none"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setShowModal(false)} 
                                        disabled={loading}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={addItem} 
                                        disabled={loading}
                                        className="px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white btn-hover-lift"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Adding...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Plus className="h-4 w-4" />
                                                <span>Add Item</span>
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
            description: "Text has been copied to your clipboard.",
            variant: "success",
            duration: 2000,
        })
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="glass rounded-2xl shadow-lg card-hover animate-slide-up">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 flex-1 mr-3">
                        {item.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                        <button
                            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200 btn-hover-lift"
                            onClick={() => onDelete(index)}
                            title="Delete item"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                            className={`p-2 rounded-xl transition-all duration-200 btn-hover-lift ${
                                copied 
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" 
                                    : "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                            onClick={handleCopy}
                            title="Copy to clipboard"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="relative">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {item.text}
                    </p>
                    {item.text.length > 150 && (
                        <div className="absolute bottom-0 right-0 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pl-8 text-xs text-gray-500 dark:text-gray-400">
                            ...
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{item.text.length} characters</span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Just now
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}