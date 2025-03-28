import { useState } from "react";
import { ClipboardCopy } from "lucide-react";

const ClipboardItem = ({item}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(item.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <div
            className="relative p-4 my-2 rounded-lg bg-white shadow-md border-l-4 border-indigo-500 transition-all hover:shadow-lg hover:border-indigo-700"
        >
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>

            {/* Text Preview */}
            <p className="mt-1 text-gray-600 text-sm truncate">{item.text.slice(0, 50)}...</p>

            {/* Copy Button */}
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-all"
            >
                <ClipboardCopy className="w-4 h-4 text-gray-700" />
            </button>

            {/* Copy Confirmation */}
            {copied && (
                <span className="absolute bottom-2 right-3 text-xs text-green-500">Copied!</span>
            )}
        </div>
    );
};

export default ClipboardItem;
