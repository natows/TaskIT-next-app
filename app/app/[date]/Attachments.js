import { useRef, useState } from "react";

export default function Attachments({ taskIndex, attachments, setAttachments }) {
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                const fileUrl = data.fileUrl;

                const updatedAttachments = { ...attachments };
                if (!updatedAttachments[taskIndex]) {
                    updatedAttachments[taskIndex] = [];
                }
                updatedAttachments[taskIndex].push(fileUrl);
                setAttachments(updatedAttachments);
            } catch (error) {
                console.error('Błąd podczas wysyłania pliku:', error);
            }
        }
    };

    const handleIconClick = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDeleteAttachment = async (fileUrl) => {
        try {
            const response = await fetch('/api/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileUrl }),
            });

            if (response.ok) {
                const updatedAttachments = { ...attachments };
                updatedAttachments[taskIndex] = updatedAttachments[taskIndex].filter(url => url !== fileUrl);
                setAttachments(updatedAttachments);
            } else {
                console.error('Błąd podczas usuwania pliku:', await response.text());
            }
        } catch (error) {
            console.error('Błąd podczas usuwania pliku:', error);
        }
    };

    return (
        <div>
            <i className="fa-solid fa-paperclip cursor-pointer" onClick={handleIconClick}></i>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-4">Attachments</h2>
                        <div className="mb-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button onClick={() => fileInputRef.current.click()} className="bg-blue-500 text-white py-2 px-4 rounded">
                                Add Attachment
                            </button>
                        </div>
                        {attachments[taskIndex] && attachments[taskIndex].map((fileUrl, fileIndex) => (
                            <div key={fileIndex} className="mt-2 flex items-center">
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mr-2">
                                    {fileUrl.split('/').pop()}
                                </a>
                                <button onClick={() => handleDeleteAttachment(fileUrl)} className="bg-red-500 text-white py-1 px-2 rounded">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        ))}
                        <button onClick={handleIconClick} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}