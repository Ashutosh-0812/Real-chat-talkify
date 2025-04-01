import React, { useContext, useState, useEffect } from 'react';
import './LeftSidebar.css';
import assets from '../../assets/assets';
import { 
  collection, query, where, getDocs, doc, setDoc, 
  updateDoc, arrayUnion, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';

const LeftSidebar = () => {
  const { userData, chatsData = [], setChatuser, setMessagesID } = useContext(AppContext);

  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.id) return;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("id", "!=", userData.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => doc.data()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData?.id]);

  const inputHandler = async (e) => {
    const input = e.target.value.trim().toLowerCase();
    
    if (!input) {
      setShowSearch(false);
      setUser(null);
      return;
    }

    setShowSearch(true);
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where("username", "==", input));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const foundUser = querySnap.docs[0].data();
        if (foundUser.id !== userData?.id) {
          setUser(foundUser);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleUserClick = async (clickedUser) => {
    // Check if chat already exists
    const existingChat = chatsData.find(chat => chat.rId === clickedUser.id);

    if (existingChat) {
      setMessagesID(existingChat.messageId);
      setChatuser(existingChat);
      return;
    }

    try {
      // Create new message document
      const newMessageRef = doc(collection(db, "messages"));
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      });

      // Define new chat data
      const chatData = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: clickedUser.id,
        updatedAt: Date.now(),
        messagesSeen: true,
        userData: clickedUser
      };

      // Update chat list in the database
      const chatsRef = doc(db, "chats", userData.id);
      await updateDoc(chatsRef, { chatsData: arrayUnion(chatData) });

      // Update UI state
      setMessagesID(newMessageRef.id);
      setChatuser(chatData);
    } catch (error) {
      console.error('Chat creation failed:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className='ls'>
      <div className='ls-nav'>
        <img src={assets.logo} className='logo' alt="ChatApp Logo" />
        <div className="menu">
          <img src={assets.menu_icon} alt="Menu" />
          <div className="sub-menu">
            <p>Edit Profile</p>
            <hr />
            <p>Logout</p>
          </div>
        </div>
      </div>

      <div className="ls-search">
        <img src={assets.search_icon} alt="Search" />
        <input 
          onChange={inputHandler} 
          type="text" 
          placeholder='Search here..' 
          data-testid="search-input"
        />
      </div>

      <div className="ls-list">
        {showSearch && user ? (
          <div 
            onClick={() => handleUserClick(user)}
            className='friends add-user'
            data-testid="new-chat-user"
          >
            <img src={user.avatar || assets.profile_img} alt="User" />
            <div>
              <p>{user.username || user.name || "Unknown User"}</p>
              <span>Click to start chatting</span>
            </div>
          </div>
        ) : (
          <>
            {chatsData.map((chat) => (
              <div 
                key={chat.messageId} 
                className="friends"
                onClick={() => {
                  setMessagesID(chat.messageId);
                  setChatuser(chat);
                }}
                data-testid={`chat-${chat.messageId}`}
              >
                <img src={chat.userData?.avatar || assets.profile_img} alt="User" />
                <div>
                  <p>{chat.userData?.name || "Unknown User"}</p>
                  <span>{chat.lastMessage || "No messages yet"}</span>
                </div>
              </div>
            ))}

            {allUsers
              .filter(u => !chatsData.some(c => c.rId === u.id))
              .map((user) => (
                <div 
                  key={user.id} 
                  className="friends"
                  onClick={() => handleUserClick(user)}
                  data-testid={`user-${user.id}`}
                >
                  <img src={user.avatar || assets.profile_img} alt="User" />
                  <div>
                    <p>{user.username || user.name || "Unknown User"}</p>
                    <span>Click to start chatting</span>
                  </div>
                </div>
              ))
            }
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
