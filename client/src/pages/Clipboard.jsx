import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClipboardItem from "../components/ClipboardItem";

const Clipboard = () => {
    const { code } = useParams();
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [clipboardExists, setClipboardExists] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API}/clipboard/${code}`);
                if (response.status === 200) {
                    setItems(response.data.items);
                    setClipboardExists(true);
                }
            } catch (error) {
                console.error("Error fetching clipboard items:", error);
                setClipboardExists(false);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [code]);

    const addItem = async () => {
        if (!title.trim() || !text.trim()) {
            alert("Title and text cannot be empty!");
            return;
        }

        const newItem = { title, text };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API}/clipboard/add-item`, {
                code,
                item: newItem,
            });

            if (response.status === 200 || response.status === 201) {
                setItems(response.data.items);
                setShowModal(false);
                setTitle("");
                setText("");
            }
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    return (
        <div className="flex flex-col items-center relative min-h-screen">
            <h1 className="text-3xl font-bold mt-4">Clipboard - {code}</h1>

            {loading ? (
                <p className="text-gray-500 text-center mt-4">Loading...</p>
            ) : clipboardExists ? (
                <div className="mt-4 w-full max-w-2xl">
                    {items.length > 0 ? (
                        items.map((item, id) => (
                            <ClipboardItem key={id} item={item}/>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No items found.</p>
                    )}
                </div>
            ) : (
                <p className="text-red-500 text-center mt-4 text-xl font-semibold">No clipboard found.</p>
            )}

            {clipboardExists && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-full shadow-lg text-lg">
                    +
                </button>
            )}

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
                        <input
                            type="text"
                            placeholder="Enter title"
                            className="w-full border p-2 mb-3 rounded"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Enter your text"
                            className="w-full border p-2 rounded h-40"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 mr-2 border rounded">Cancel</button>
                            <button onClick={addItem} className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clipboard;
