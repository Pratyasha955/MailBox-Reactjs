import React from 'react';
import './EmailCardDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function EmailCardDetails({ email, onBack  }) {
    const messageData = JSON.parse(email.message);
    const messageText = messageData.blocks.map(block => block.text).join('\n');

    return (
        <div className='email-details-container'>
            <div className='email-details'>
                <button onClick={onBack}><FontAwesomeIcon icon={faArrowLeft} /></button>
                <p><span className="label">From:</span> <strong>{email.sender}</strong></p>
                <p><span className="label">To:</span> <strong>{email.receiver}</strong></p>
                <p><span className="label">Subject:</span> <strong>{email.subject}</strong></p>
                <p><span className="label">Message:</span></p>
                <p>{messageText}</p>
                <p><span className="label">Sent at:</span> <strong>{email.timestamp}</strong></p>
            </div>
        </div>
    );
}

export default EmailCardDetails ;
