import React, { useContext, useState, useEffect } from 'react';
import './Chat.css';
import LeftSidebar from '../../components/LeftSidebar/LeftSIdebar';
import RightSidebar from '../../components/RightSidebar/RightSidebar';
import ChatBox from '../../components/ChatBox/ChatBox';
import { AppContext } from '../../context/AppContext';

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);

  return (
    <div className='chat'>
      <div className='chat-container'>
        {loading ? (
          <p className='loading'>loading...</p>
        ) : (
          <>
            <LeftSidebar />
            <ChatBox />
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;