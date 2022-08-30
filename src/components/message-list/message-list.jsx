import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectMessages,
  selectMessageThreads,
  selectUsersInfo
} from '../../redux/slices/messagesSlice';
import { selectUser } from '../../redux/slices/userSlice';
import EmptyState from '../empty-state/empty-state';
import MessageListItem from '../message-list-item/message-list-item';
import SearchBar from '../search-bar/search-bar';
import { MdFormatListBulleted } from 'react-icons/md';
import './message-list.scss';

function MessageList() {
  const user = useSelector(selectUser);
  const messages = useSelector(selectMessages);
  const messageThreads = useSelector(selectMessageThreads);
  const usersInfo = useSelector(selectUsersInfo);

  const [messageListItems, setMessageListItems] = useState([]);

  // Sets the custom message list items to be displayed in message list
  useEffect(() => {
    if (
      messageThreads.length > 0 &&
      usersInfo.length > 0 &&
      messages.length > 0
    ) {
      const items = messageThreads.map((m) => {
        // Gets the user that is in the message thread other than current user
        const otherUserUid = m.users.filter((u) => u !== user.uid)[0];
        const otherUser = usersInfo.filter((i) => i.uid === otherUserUid)[0];

        if (otherUser) {
          // Have to do this because messages variable is immutable
          const tempMessages = [...messages];
          // Get messages associated with this specific message thread
          const threadMessages = tempMessages.filter(
            (msg) => msg.message_thread_id === m.id
          );
          // Sorting messages in descending order
          const sortedMessages = threadMessages.sort(
            (msgA, msgB) => msgB.sent_at.toDate() - msgA.sent_at.toDate()
          );

          return {
            display_name: otherUser.display_name,
            id: m.id,
            last_message:
              sortedMessages.length > 0 ? sortedMessages[0].message : '',
            messages: threadMessages,
            online: otherUser.online,
            photo_url: otherUser.photo_url,
            user_uid: otherUser.uid
          };
        }

        return {};
      });
      setMessageListItems(items);
    }
  }, [user, messageThreads, usersInfo, messages]);

  return (
    <div className="message-list-container card-background">
      <SearchBar />

      {messageListItems.length > 0 ? (
        <div className="messages-container">
          <ul className="message-list">
            {messageListItems.map((item, index) => (
              <MessageListItem key={index} index={index} item={item} />
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          title={'No Messages'}
          description={'Start a new message above to get started!'}
          icon={<MdFormatListBulleted />}
          containerPadding={{ padding: '40% 20px 20px 20px' }}
        />
      )}
    </div>
  );
}

export default MessageList;
