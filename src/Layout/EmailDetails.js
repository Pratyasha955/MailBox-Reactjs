import React from 'react';
import './EmailDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function EmailDetails({ email, onBack  }) {
    const messageData = JSON.parse(email.message);
    const messageText = messageData.blocks.map(block => block.text).join('\n');

    return (
        <div className='email-details-container'>
            <div className='email-details'>
            <button onClick={onBack}><FontAwesomeIcon icon={faArrowLeft} /></button>
                <p>From: {email.sender}</p>
                <p>To: {email.receiver}</p>
                <p>Subject: {email.subject}</p>
                <p>Message:</p>
                <p>{messageText}</p>
                <p>Sent at: {email.timestamp}</p>
            </div>
        </div>
    );
}

export default EmailDetails;