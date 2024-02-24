import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInbox, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import './Sidebar.css';

function Sidebar({ onComposeClick, onInboxClick, onSentClick }) {
  const currentUserEmail = useSelector((state) => state.auth.user?.email);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const sanitizedRecipientEmail = currentUserEmail.replace(/[@.]/g, '');
        const response = await fetch(`https://mail-box-cf1f8-default-rtdb.firebaseio.com/${sanitizedRecipientEmail}/inbox.json`);

        if (!response.ok) {
          throw new Error('Failed to fetch unread count');
        }
        const data = await response.json();
        let count = 0;
        for (const emailId in data) {
          if (!data[emailId].read) {
            count++;
          }
        }
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    const interval = setInterval(fetchUnreadCount, 2000); 

    return () => clearInterval(interval); 
  }, [currentUserEmail]); 

  const handleComposeClick = () => {
    onComposeClick();
  };

  const handleInboxClick = () => {
    onInboxClick();
  };

  const handleSentClick = () => {
    onSentClick();
  };

  return (
    <div className="sidebar">
      <div className="d-flex flex-column align-items-center p-3">
        <button className="btn btn-primary mb-3" onClick={handleComposeClick}>
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Compose
        </button>
        <button className="btn btn-light" onClick={handleInboxClick}>
          <FontAwesomeIcon icon={faInbox} className="mr-2" />
          Inbox
          {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
        </button>
        <div style={{ marginBottom: '20px' }}></div>
        <button className="btn btn-light" onClick={handleSentClick}>
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Sent
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
