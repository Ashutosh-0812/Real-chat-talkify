import React, { useContext, useEffect, useState } from 'react';
import './ChatBox.css';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createAt: new Date(),
          }),
        });

        const userIDS = [chatUser.rId, userData.id];

        userIDS.forEach(async (id) => {
          const userChatRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messagesId === messagesId);
            
            if (chatIndex !== -1) {
              userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
              userChatData.chatsData[chatIndex].updateAt = Date.now();
              
              if (userChatData.chatsData[chatIndex].rId === userData.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }

              await updateDoc(userChatRef, {
                chatsData: userChatData.chatsData,
              });
            }
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  };

  const sendImage = async (e) => {
    try {
      const fileUrl = await uploadBytes(e.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: fileUrl,
            createAt: new Date(),
          }),
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const convertTimestamp = (timeStamp) => {
    let date = timeStamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    return hour > 12 
      ? `${hour - 12}:${minute} PM` 
      : `${hour}:${minute} AM`;
  };
  useEffect(() => {
    if (messagesId) {
      const unsub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        setMessages(res.data()?.messages.reverse() || []);
      });
      return () => unsub();
    } else {
      setMessages([]); // Clear messages when no chat is selected
    }
  }, [messagesId, chatUser]);
  

  return chatUser ? (
    <div className='chat-box'>
      <div className='chat-user'>
        <img src={chatUser.userData.avatar} alt='' />
        <p>
          {chatUser.userData.className}{' '}
          <img className='dot' src={assets.green_dot} alt='' />
        </p>
        <img src={assets.help_icon} className='help' alt='' />
      </div>
      <div className='chat-msg'>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? 's-msg' : 'r-msg'}>
            <p className='msg'>{msg.text}</p>
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt='' />
              <p>{convertTimestamp(msg.createAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='chat-input'>
        <input 
          onChange={(e) => setInput(e.target.value)} 
          value={input} 
          type='text' 
          placeholder='Send a message' 
        />
        <input onChange={sendImage} type='file' id='image' accept='image/png, image/jpeg' hidden />
        <label htmlFor='image'>
          <img src={assets.gallery_icon} alt='' />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt='' />
      </div>
    </div>
  ) : (
    <div className='chat-welcome'>
      <img src={assets.logo_icon} alt='' />
      <p>Chat Anytime, Anywhere</p>
    </div>
  );
};

export default ChatBox;
