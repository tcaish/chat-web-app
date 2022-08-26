import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageConverter } from '../../classes/Message';
import { selectMessages, setMessages } from '../../redux/slices/messagesSlice';
import { firestore } from '../../utils/firebase/firebase';
import Message from '../message/message';
import './message-view-conversation.scss';

function MessageViewConversation({ selectedMessageListItem }) {
  const dispatch = useDispatch();

  const messages = useSelector(selectMessages);

  const [threadMessages, setThreadMessages] = useState([]);

  // Listen for new messages in the message thread
  useEffect(() => {
    const q = query(
      collection(
        firestore,
        'message_threads',
        selectedMessageListItem.id,
        'messages'
      ).withConverter(messageConverter)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = [];

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

          const newMessages = [...messages, data];
          dispatch(setMessages(newMessages));
        }
      });
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line
  }, [selectedMessageListItem.id]);

  // Scroll to bottom of message list
  useEffect(() => {
    setTimeout(() => {
      var listDiv = document.getElementsByClassName(
        'message-view-conversation-list'
      )[0];
      var conversationDiv = document.getElementsByClassName(
        'message-view-conversation-container'
      )[0];
      conversationDiv.scrollTop = listDiv.scrollHeight;
    }, 1);
  }, [threadMessages]);

  return (
    <div className="message-view-conversation-container">
      <ul className="message-view-conversation-list">
        {threadMessages
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
