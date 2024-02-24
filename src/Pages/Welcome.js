import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/header';
import Sidebar from '../Layout/sidebar'; 
import { useSelector } from 'react-redux';
import Inbox from '../Layout/Inbox';
import ComposeEmail from '../Layout/ComposeEmail';
import Sent from '../Layout/Sent';
import './Welcome.css';

function Welcome() {
    const [showCompose, setShowCompose] = useState(false);
    const [showInbox, setShowInbox] = useState(true);
    const [showSentMail, setShowSentMail] = useState(false);
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const openCompose = () => {
        setShowCompose(true);
        setShowSentMail(false);
        setShowInbox(false);
    };

    const toggleSentMail = () => {
        setShowSentMail(true);
        setShowInbox(false);
        setShowCompose(false);
    };

    const closeCompose = () => {
        setShowCompose(false);
    };

    const openInbox = () => {
        setShowInbox(true);
        setShowSentMail(false);
        setShowCompose(false);
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-3">
                        <Sidebar onComposeClick={openCompose} onInboxClick={openInbox} onSentClick={toggleSentMail}/>
                    </div>
                    <div className="col d-flex justify-content-center">
                        {showCompose ? (
                            <ComposeEmail onClose={closeCompose} />
                        ) : showSentMail ? (
                            <Sent />
                        ) : (
                            <Inbox show={showInbox} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
