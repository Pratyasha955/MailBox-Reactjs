import React, { useState } from 'react';
import {  convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ComposeEmail.css';
import { useSelector } from 'react-redux';

function ComposeEmail({ onClose }) {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [editorState, setEditorState] = useState(null);
    const currentUserEmail = useSelector((state) => state.auth.user?.email);

    const handleToChange = (e) => {
        setTo(e.target.value);
    };

    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
    };

    const getCurrentIndianTime = () => {
        const options = {
            timeZone: 'Asia/Kolkata',
            hour12: false,
        };

        return new Date().toLocaleString('en-US', options);
    };

    const handleSend = async (e) => {
        e.preventDefault();

        try {
            const emailData = {
                sender: currentUserEmail,
                receiver: to,
                subject,
                message: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
                timestamp: getCurrentIndianTime(),
                read: false,
            };

            const sanitizedSenderEmail = currentUserEmail.replace(/[@.]/g, '');
            const sanitizedRecipientEmail = to.replace(/[@.]/g, '');

            const sentboxResponse = await fetch(`https://mailbox-7d546-default-rtdb.firebaseio.com/${sanitizedSenderEmail}/sentbox.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            if (!sentboxResponse.ok) {
                throw new Error('Failed to save in sentbox');
            }

            const inboxResponse = await fetch(`https://mailbox-7d546-default-rtdb.firebaseio.com/${sanitizedRecipientEmail}/inbox.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            if (!inboxResponse.ok) {
                throw new Error('Failed to save in inbox');
            }
            onClose();
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div className="compose-email-wrapper">
            <div className="compose-email">
                <div className="compose-email-header">
                    <h3>Compose Email</h3>
                    <button className="close-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <form onSubmit={handleSend}>
                    <div className="compose-email-fields">
                        <div className="form-group">
                            <label htmlFor="to">To:</label>
                            <input
                                type="email"
                                id="to"
                                className="form-control"
                                value={to}
                                onChange={handleToChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject:</label>
                            <input
                                type="text"
                                id="subject"
                                className="form-control"
                                value={subject}
                                onChange={handleSubjectChange}
                            />
                        </div>
                    </div>
                    <div className="compose-email-editor">
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={setEditorState}
                        />
                    </div>
                    <div className="compose-emails-footer">
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPaperPlane} /> Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ComposeEmail;
