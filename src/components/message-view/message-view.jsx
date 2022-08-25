import { useSelector } from 'react-redux';
import { selectSelectedMessageListItem } from '../../redux/slices/messagesSlice';
import Message from '../message/message';
import './message-view.scss';

function MessageView() {
  const selectedMessageListItem = useSelector(selectSelectedMessageListItem);

  return (
    <div className="message-view-container card-background">
      {selectedMessageListItem ? (
        <>
          <div className="message-view-header">
            <div className="message-image">
              <img src={selectedMessageListItem.photo_url} alt="profile" />
              <span
                className={
                  selectedMessageListItem.online ? 'online' : 'offline'
                }
              ></span>
            </div>
            <div className="message-info">
              <span>
                Conversation with {selectedMessageListItem.display_name}
              </span>
              <p className="online-text">
                {selectedMessageListItem.messages.length}{' '}
                {selectedMessageListItem.messages.length === 1
                  ? 'message'
                  : 'messages'}
              </p>
            </div>
          </div>
          <div className="message-view-conversation">
            <ul>
              {[...selectedMessageListItem.messages]
                .sort(
                  (msgA, msgB) => msgA.sent_at.toDate() - msgB.sent_at.toDate()
                )
                .map((msg, index) => (
                  <li key={index}>
                    <Message message={msg} />
                  </li>
                ))}
            </ul>
          </div>
        </>
      ) : (
        <div>Empty message view</div>
      )}
    </div>
  );
}

export default MessageView;
