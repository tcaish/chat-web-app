import { toaster } from 'evergreen-ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedMessageListItem } from '../../redux/slices/messagesSlice';
import { selectUser } from '../../redux/slices/userSlice';
import { addMessageToMessageThread } from '../../utils/firebase/firebase-adders';
import MessageViewConversation from '../message-view-conversation/message-view-conversation';
import MessageViewFooter from '../message-view-footer/message-view-footer';
import MessageViewHeader from '../message-view-header/message-view-header';
import './message-view.scss';

function MessageView() {
  const user = useSelector(selectUser);
  const selectedMessageListItem = useSelector(selectSelectedMessageListItem);

  const [inputText, setInputText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Sends the message
  async function sendMessage(inputText) {
    if (sendingMessage || !inputText) return;

    setSendingMessage(true);

    const messageThreadId = selectedMessageListItem.id;
    const options = {
      message: inputText,
      message_thread_id: messageThreadId,
      sender: user.uid,
      sent_at: new Date()
    };

    await addMessageToMessageThread(messageThreadId, options).then((res) => {
      setSendingMessage(false);

      if (res.added) {
        setInputText('');
        toaster.success('Message Sent', {
          duration: 4
        });
      } else {
        toaster.danger('Message Failed to Send', {
          description: res.error,
          duration: 7
        });
      }
    });
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
            inputText={inputText}
            setInputText={setInputText}
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
