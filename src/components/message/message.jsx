import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUsersInfo } from '../../redux/slices/messagesSlice';
import './message.scss';

function Message({ message }) {
  const usersInfo = useSelector(selectUsersInfo);

  const [photoURL, setPhotoURL] = useState('');

  // Sets the photo URL for the sender of the message
  useEffect(() => {
    if (usersInfo) {
      const user = usersInfo.filter((u) => u.uid === message.sender)[0];
      setPhotoURL(user.photo_url);
    }
  }, [message.sender, usersInfo]);

  return (
    <div className="message-container">
      {photoURL && (
        <>
          <div className="message-image">
            <img src={photoURL} alt="profile" />
          </div>

          <div className="message-content">
            {message.message}
            <span>{message.getFormattedDateForMessage()}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default Message;
