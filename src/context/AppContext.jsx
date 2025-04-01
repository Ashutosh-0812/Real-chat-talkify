import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { getDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messageId,setMessagesID]= useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser,setChatUser]= useState(null);


    const loadUserData = async (uid) => {
        try { 
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData);
            
            if (userData.avatar && userData.name) {
                navigate('/chat');
            } else {
                navigate('/profile');
            }

            await updateDoc(userRef, {
                lastSeen: Date.now()
            });

            const intervalId = setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                }
            }, 60000);

            return () => clearInterval(intervalId);

        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                if (res.exists()) {
                    const chatItems = res.data().chatsData || [];
                    
                    const tempData = [];
                    
                    for (const item of chatItems) {
                        const userRef = doc(db, 'users', item.rId);
                        const userSnap = await getDoc(userRef);
                        const userData = userSnap.data();
                        tempData.push({ ...item, userData });
                    }
                    setChatData(tempData.sort((a, b) => b.updateAt - a.updateAt));
                }
            });
            return () => unSub();
        }
    }, [userData]);

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
        messages,
        setMessages,
        messageId,
        setMessagesID,
        chatUser,
        setChatUser: (user) => {
            setChatUser(null); // Reset first
            setTimeout(() => setChatUser(user), 100); // Set after delay
        }
    };
    

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;