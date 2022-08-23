import './message-list-item.scss';

function MessageListItem(props) {
  return (
    <li
      className={`message-list-item-container ${
        props.selectedMessage === props.index && 'active'
      }`}
      onClick={() => props.setSelectedMessage(props.index)}
    >
      <div className="message-content">
        <div className="message-image">
          <img src={props.item.photo_url} alt="profile" />
          <span className={props.item.online ? 'online' : 'offline'}></span>
        </div>
        <div className="message-info">
          <span>{props.item.display_name}</span>
          <p className="online-text">
            {props.item.display_name.split(' ')[0]} is{' '}
            {props.item.online ? 'online' : 'offline'}
          </p>
          <p className="message-text">{props.item.last_message}</p>
        </div>
      </div>
    </li>
  );
}

export default MessageListItem;
