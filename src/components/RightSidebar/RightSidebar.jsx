import React from 'react';
import './RightSidebar.css';
import assets from '../../assets/assets';
import { logout } from '../../config/firebase';

const RightSidebar = () => {
  return (
    <div className='rs'>
      <div className="rs-profile">
        <img src={assets.profile_img} alt="Profile" />
        <h3>Ashish Singh <img className="dot" src={assets.green_dot} alt="Online" /></h3>
        <p>Hey there, I am Ashish Singh using Talkify</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="Media 1" />
          <img src={assets.pic2} alt="Media 2" />
          <img src={assets.pic3} alt="Media 3" />
          <img src={assets.pic4} alt="Media 4" />
          <img src={assets.pic1} alt="Media 5" />
          <img src={assets.pic2} alt="Media 6" />
        </div>
      </div>
      <button onClick={()=>logout()}>Logout</button>
    </div>
  );
};

export default RightSidebar;