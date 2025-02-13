import React from "react";

export default function CommentModal({ comments, commentInput, onCommentInputChange, onSaveComment, onClose, onDeleteComment, currentUser }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                <div className="mb-4 max-h-64 overflow-y-auto">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="border-b py-2 flex justify-between items-center">
                                <span>{comment}</span>
                                {comment.startsWith(`${currentUser}:`) && (
                                    <button onClick={() => onDeleteComment(index)} className="text-red-500 ml-2">
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
                <textarea
                    value={commentInput}
                    onChange={onCommentInputChange}
                    className="border rounded p-2 w-full mb-4"
                    rows="2"
                />
                <button onClick={onSaveComment} className="bg-green-500 text-white py-2 px-4 rounded mr-2">
                    Save
                </button>
                <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>
    );
}