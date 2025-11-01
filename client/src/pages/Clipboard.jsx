import { useEffect, useState, useMemo } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {Plus, X, Check, Loader2, Copy, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import axios from "axios"

export default function Clipboard(props) {
    const { code } = useParams()
    const [items, setItems] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [title, setTitle] = useState("No Title")
    const [text, setText] = useState("")
    const [clipboardExists, setClipboardExists] = useState(true)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const [searchParams] = useSearchParams();
    const qRaw = searchParams.get("q") || "";
    const q = qRaw.trim().toLowerCase();

    const filteredEntries = useMemo(() => {
        if (!q) return items;
        return items.filter((entry) => {
            const title = (entry.title || "").toString().toLowerCase();
            const text = (entry.text || "").toString().toLowerCase();
            return title.includes(q) || text.includes(q);
        });
    }, [items, q]);

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
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            <Navbar />
            <main className="flex-1 container py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">
                        Clipboard <span className="text-violet-600 dark:text-violet-400">{code}</span>
                    </h1>
                </div>

                {loading ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="relative overflow-hidden bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-12 animate-pulse"></div>
                        ))}
                    </div>
                ) : clipboardExists ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEntries.length > 0 ? (
                            filteredEntries.map((item, index) => (
                                <ClipboardItem key={index} index={index} item={item} toast={toast} onDelete={deleteItem} />
                              )).reverse()                                                         
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    No items found
                                </h3>
                                <Button onClick={() => setShowModal(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Item
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-red-500 mb-2">No clipboard found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">The clipboard code you entered doesn't exist</p>
                    </div>
                )}

                {clipboardExists && items.length > 0 && (
                    <Button
                        onClick={() => setShowModal(true)}
                        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                )}

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Add New Item</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    disabled={loading}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Input Fields */}
                            <div className="grid gap-4 py-4">
                                <Input
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={loading}
                                />
                                <Textarea
                                    placeholder="Enter your text"
                                    className="min-h-[150px]"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setShowModal(false)} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button onClick={addItem} disabled={loading}>
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        </span>
                                    ) : (
                                        "Add Item"
                                    )}
                                </Button>
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
            duration: 2000,
        })
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</h3>
                    <div className="flex gap-2">
                        <button
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 hover:bg-red-200 dark:hover:bg-red-800 transition cursor-pointer"
                            onClick={() => onDelete(index)}
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                            className={`p-2 rounded-full border transition-all ${copied ? "bg-green-500/20 border-green-500 text-green-500" : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                                }`}
                            onClick={handleCopy}
                        >
                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{item.text}</p>
            </div>
        </div>
    )
}
