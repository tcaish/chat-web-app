import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUsersInfo } from '../../redux/slices/messagesSlice';
import { selectUser } from '../../redux/slices/userSlice';
import './message.scss';

function Message({ message }) {
  const user = useSelector(selectUser);
  const usersInfo = useSelector(selectUsersInfo);

  const [photoURL, setPhotoURL] = useState('');
  const [isUsersMessage, setIsUsersMessage] = useState(false);

  // Sets the photo URL for the sender of the message
  // Sets the type of message to display (user's or other user's)
  useEffect(() => {
    if (usersInfo) {
      const sender = usersInfo.filter((u) => u.uid === message.sender)[0];
      setPhotoURL(sender.photo_url);
      setIsUsersMessage(sender.uid === user.uid);
    }
  }, [user, message.sender, usersInfo]);

  return isUsersMessage ? (
    <div className="message-container message-container-left-aligned">
      {photoURL && (
        <>
          <div className="message-image">
            <img src={photoURL} alt="profile" />
          </div>

          <div className="message-content message-content-left-aligned">
            {message.message}
            <span className="message-content-time message-content-time-left-aligned">
              {message.getFormattedDateForMessage()}
            </span>
          </div>
        </>
      )}
    </div>
  ) : (
    <div className="message-container message-container-right-aligned">
      {photoURL && (
        <>
          <div className="message-content message-content-right-aligned">
            {message.message}
            <span className="message-content-time message-content-time-right-aligned">
              {message.getFormattedDateForMessage()}
            </span>
          </div>

          <div className="message-image">
            <img src={photoURL} alt="profile" />
          </div>
        </>
      )}
    </div>
  );
}

export default Message;
