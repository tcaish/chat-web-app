import { useSelector } from 'react-redux';
import { selectSelectedMessageListItem } from '../../redux/slices/messagesSlice';
import './message-view.scss';

function MessageView() {
  const selectedMessageListItem = useSelector(selectSelectedMessageListItem);

  return (
    <div className="message-view-container card-background">
      {selectedMessageListItem && (
        <div className="message-view-header">
          <div className="message-image">
            <img src={selectedMessageListItem.photo_url} alt="profile" />
            <span
              className={selectedMessageListItem.online ? 'online' : 'offline'}
            ></span>
          </div>
          <div className="message-info">
            <span>
              Conversation with {selectedMessageListItem.display_name}
            </span>
            <p className="online-text">
              {selectedMessageListItem.total_messages}{' '}
              {selectedMessageListItem.total_messages === 1
                ? 'message'
                : 'messages'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageView;
