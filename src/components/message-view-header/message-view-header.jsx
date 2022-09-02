import { Avatar } from 'evergreen-ui';
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
        <Avatar
          size={70}
          referrerPolicy="no-referrer"
          name={
            selectedMessageListItem.display_name
              ? selectedMessageListItem.display_name
              : ''
          }
          src={
            selectedMessageListItem.photo_url
              ? selectedMessageListItem.photo_url
              : ''
          }
          style={{
            backgroundColor: selectedMessageListItem.photo_url && 'white'
          }}
        />

        {selectedMessageUserOnline ? (
          <span className="online-indicator online"></span>
        ) : (
          <span className="online-indicator offline"></span>
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
