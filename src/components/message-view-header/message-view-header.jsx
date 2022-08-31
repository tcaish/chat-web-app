import { useSelector } from 'react-redux';
import { selectSelectedMessageUserOnline } from '../../redux/slices/messagesSlice';
import './message-view-header.scss';

function MessageViewHeader({ selectedMessageListItem, totalMessages }) {
  const selectedMessageUserOnline = useSelector(
    selectSelectedMessageUserOnline
  );

  return (
    <div className="message-view-header-container">
      <div className="message-image">
        <img src={selectedMessageListItem.photo_url} alt="profile" />
        {selectedMessageUserOnline ? (
          <span className="online"></span>
        ) : (
          <span className="offline"></span>
        )}
      </div>
      <div className="message-info">
        <span>Conversation with {selectedMessageListItem.display_name}</span>
        <p className="sub-text">
          {totalMessages} {totalMessages === 1 ? 'message' : 'messages'}
        </p>
      </div>
    </div>
  );
}

export default MessageViewHeader;
