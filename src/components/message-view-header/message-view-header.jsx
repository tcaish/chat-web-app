import './message-view-header.scss';

function MessageViewHeader({ selectedMessageListItem }) {
  return (
    <div className="message-view-header-container">
      <div className="message-image">
        <img src={selectedMessageListItem.photo_url} alt="profile" />
        <span
          className={selectedMessageListItem.online ? 'online' : 'offline'}
        ></span>
      </div>
      <div className="message-info">
        <span>Conversation with {selectedMessageListItem.display_name}</span>
        <p className="online-text">
          {selectedMessageListItem.messages.length}{' '}
          {selectedMessageListItem.messages.length === 1
            ? 'message'
            : 'messages'}
        </p>
      </div>
    </div>
  );
}

export default MessageViewHeader;
