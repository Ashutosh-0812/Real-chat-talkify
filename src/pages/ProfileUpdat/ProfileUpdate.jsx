import React, { useEffect, useState, useContext } from 'react';
import './ProfileUpdate.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUid] = useState("");
    const [prevImage, setPrevImage] = useState("");
    const { setUserData } = useContext(AppContext);

    const profileUpdate = async (event) => {
        event.preventDefault();
        try {
            const docRef = doc(db, 'users', uid);
            let updateData = {
                bio: bio,
                name: name
            };

            if (image) {
                const imgurl = await upload(image);
                updateData.avatar = imgurl;
                setPrevImage(imgurl);
            }

            await updateDoc(docRef, updateData);
            toast.success("Profile updated successfully!");
            const snap = await getDoc(docRef);
            setUserData(snap.data());
            navigate('/chat');
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.name || "");
                    setBio(data.bio || "");
                    setPrevImage(data.avatar || "");
                }
            } else {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className='profile'>
            <div className="profile-container">
                <form onSubmit={profileUpdate}>
                    <h3>Profile Details</h3>
                    <label htmlFor="avatar">
                        <input 
                            onChange={(e) => setImage(e.target.files[0])} 
                            type="file" 
                            id='avatar' 
                            accept='.png, .jpg, .jpeg' 
                            hidden 
                        />
                        <img 
                            src={image ? URL.createObjectURL(image) : prevImage || assets.avatar_icon} 
                            alt="Profile" 
                        />
                        {prevImage ? "Change Profile Image" : "Upload Profile Image (Optional)"}
                    </label>
                    <input 
                        onChange={(e) => setName(e.target.value)} 
                        value={name} 
                        type="text" 
                        placeholder='Your name' 
                        required 
                    />
                    <textarea 
                        onChange={(e) => setBio(e.target.value)} 
                        value={bio} 
                        placeholder='Write Profile bio' 
                        required
                    />
                    <button type='submit'>Save</button>
                </form>
                <img 
                    className='profile-pic' 
                    src={image ? URL.createObjectURL(image) : prevImage ? prevImage:  assets.logo_icon} 
                    alt="Profile Preview" 
                />
            </div>
        </div>
    );
};

export default ProfileUpdate;