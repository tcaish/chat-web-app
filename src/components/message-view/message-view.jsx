import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedMessageListItem } from '../../redux/slices/messagesSlice';
import MessageViewConversation from '../message-view-conversation/message-view-conversation';
import MessageViewFooter from '../message-view-footer/message-view-footer';
import MessageViewHeader from '../message-view-header/message-view-header';
import './message-view.scss';

function MessageView() {
  const selectedMessageListItem = useSelector(selectSelectedMessageListItem);

  const [sendingMessage, setSendingMessage] = useState(false);

  // Sends the message
  async function sendMessage(inputText) {
    if (sendingMessage || !inputText) return;

    setSendingMessage(true);
  }

  return (
    <div className="message-view-container card-background">
      {selectedMessageListItem ? (
        <>
          <MessageViewHeader
            selectedMessageListItem={selectedMessageListItem}
          />
          <MessageViewConversation
            selectedMessageListItem={selectedMessageListItem}
          />
          <MessageViewFooter
            sendMessage={sendMessage}
            sendingMessage={sendingMessage}
          />
        </>
      ) : (
        <div>Empty message view</div>
      )}
    </div>
  );
}

export default MessageView;
