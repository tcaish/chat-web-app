import Message from '../message/message';
import './message-view-conversation.scss';

function MessageViewConversation({ selectedMessageListItem }) {
  return (
    <div className="message-view-conversation-container">
      <ul>
        {[...selectedMessageListItem.messages]
          .sort((msgA, msgB) => msgA.sent_at.toDate() - msgB.sent_at.toDate())
          .map((msg, index) => (
            <li key={index}>
              <Message message={msg} />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default MessageViewConversation;
