import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSentMails } from '../Reducer/sentSlice'; 
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmailCardDetails from './EmailCardDetails'; 

function Sent() {
  const currentUserEmail = useSelector((state) => state.auth.user?.email);
  const sentMails = useSelector((state) => state.sent.sentMails); 
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null); 
  const [showEmailDetails, setShowEmailDetails] = useState(false);

  // Fetch sent emails
  const fetchSentEmails = useCallback(async () => {
    try {
      const sanitizedSenderEmail = currentUserEmail.replace(/[@.]/g, '');
      const response = await fetch(`https://mailbox-7d546-default-rtdb.firebaseio.com/${sanitizedSenderEmail}/sentbox.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch sentbox');
      }
      const data = await response.json();

      if (data) {
        const emails = Object.keys(data).map(timestamp => {
          const emailData = data[timestamp];
          return {
            id: timestamp,
            sender: emailData.sender,
            receiver: emailData.receiver,
            subject: emailData.subject,
            message: emailData.message,
            timestamp: emailData.timestamp,
            read: emailData.read || false 
          };
        });
        dispatch(setSentMails(emails));
      }
    } catch (error) {
      console.error('Error fetching sent emails:', error);
    }
  }, [currentUserEmail, dispatch]);

  useEffect(() => {
    fetchSentEmails();
  }, [fetchSentEmails]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmails(sentMails);
    } else {
      const filtered = sentMails.filter(email =>
        email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (email.message && email.message.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredEmails(filtered);
    }
  }, [searchQuery, sentMails]);



    const handleEmailClick = async (email) => {
        const updatedEmails = sentMails.map(item => {
            if (item.id === email.id && !item.read) {
                return { ...item, read: true };
            }
            return item;
        });
        setFilteredEmails(updatedEmails);
        setSelectedEmail(email);
        setShowEmailDetails(true); 

        try {
            const sanitizedRecipientEmail = currentUserEmail.replace(/[@.]/g, '');
            const response = await fetch(`https://mailbox-7d546-default-rtdb.firebaseio.com/${sanitizedRecipientEmail}/sentbox/${email.id}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ read: true })
            });
            if (!response.ok) {
                throw new Error('Failed to update read status in Firebase');
            }
        } catch (error) {
            console.error('Error updating read status in Firebase:', error);
        }
    };

    const handleDelete = async (emailId) => {
        try {
            const sanitizedRecipientEmail = currentUserEmail.replace(/[@.]/g, '');
            const response = await fetch(`https://mailbox-7d546-default-rtdb.firebaseio.com/${sanitizedRecipientEmail}/sentbox/${emailId}.json`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete email from Firebase');
            }
            const updatedEmails = sentMails.filter(email => email.id !== emailId);
            dispatch(setSentMails(updatedEmails));
        } catch (error) {
            console.error('Error deleting email:', error);
        }
    };

    const handleBackToInbox = () => {
        setShowEmailDetails(false); 
    };

    const renderSelectedEmail = () => {
        if (selectedEmail && showEmailDetails) {
            return <EmailCardDetails email={selectedEmail} onBack={handleBackToInbox} />;
        }
        return null;
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className={`col ${showEmailDetails ? 'd-none' : ''}`}>
                    <div className="inbox-container">
                        <h2>Sent</h2>
                        <div className="action-bar">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)} />
                                <button type="button">Search</button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <tbody>
                                    {filteredEmails.map((email, index) => (
                                        <tr key={email.id} onClick={() => handleEmailClick(email)}>
                                            <td className="action"><input type="checkbox" /></td>
                                            <td className="name">
                                                { !email.read && <span className="dot blue-dot"></span> }
                                                TO:{email.receiver}
                                            </td>
                                            <td className="subject">{email.subject}</td>
                                            <td className="time">{email.timestamp}</td>
                                            <td className="delete-icon" onClick={(e) => { e.stopPropagation(); handleDelete(email.id); }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className={`col ${showEmailDetails ? '' : 'd-none'}`}>
                    {renderSelectedEmail()}
                </div>
            </div>
        </div>
    );
}

export default Sent;
