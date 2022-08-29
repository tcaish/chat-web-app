import { toaster } from 'evergreen-ui';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageConverter } from '../../classes/Message';
import {
  selectMessages,
  selectSelectedMessageListItem,
  setMessages
} from '../../redux/slices/messagesSlice';
import { selectUser } from '../../redux/slices/userSlice';
import { firestore } from '../../utils/firebase/firebase';
import { addMessageToMessageThread } from '../../utils/firebase/firebase-adders';
import { editMessageThreadUsersTyping } from '../../utils/firebase/firebase-modifiers';
import MessageViewConversation from '../message-view-conversation/message-view-conversation';
import MessageViewFooter from '../message-view-footer/message-view-footer';
import MessageViewHeader from '../message-view-header/message-view-header';
import './message-view.scss';
import EmptyState from '../empty-state/empty-state';

function MessageView() {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const selectedMessageListItem = useSelector(selectSelectedMessageListItem);
  const messages = useSelector(selectMessages);

  const [inputText, setInputText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const [threadMessages, setThreadMessages] = useState([]);
  const [totalMessages, setTotalMessages] = useState(0);

  // Listen for new messages in the message thread
  useEffect(() => {
    if (!selectedMessageListItem) return;

    const q = query(
      collection(
        firestore,
        'message_threads',
        selectedMessageListItem.id,
        'messages'
      ).withConverter(messageConverter)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let tempMessages = [];

      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        tempMessages.push(data);
      });

      setThreadMessages(tempMessages);

      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          let data = change.doc.data();
          data.id = change.doc.id;

          setTotalMessages(querySnapshot.size);

          const newMessages = [...messages, data];
          dispatch(setMessages(newMessages));
        }
      });
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line
  }, [selectedMessageListItem]);

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

        editMessageThreadUsersTyping(messageThreadId, user.uid, false);
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
            totalMessages={totalMessages}
          />
          <MessageViewConversation
            selectedMessageListItem={selectedMessageListItem}
            threadMessages={threadMessages}
          />
          <MessageViewFooter
            messageThreadId={selectedMessageListItem.id}
            inputText={inputText}
            setInputText={setInputText}
            sendMessage={sendMessage}
            sendingMessage={sendingMessage}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default MessageView;
