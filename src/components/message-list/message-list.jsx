import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectMessages,
  selectMessageThreads,
  selectUsersInfo
} from '../../redux/slices/messagesSlice';
import { selectUser } from '../../redux/slices/userSlice';
import MessageListItem from '../message-list-item/message-list-item';
import SearchBar from '../search-bar/search-bar';
import './message-list.scss';

function MessageList() {
  const user = useSelector(selectUser);
  const messages = useSelector(selectMessages);
  const messageThreads = useSelector(selectMessageThreads);
  const usersInfo = useSelector(selectUsersInfo);

  const [messageListItems, setMessageListItems] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(0);

  // Sets the custom message list items to be displayed in message list
  useEffect(() => {
    if (
      messageThreads.length > 0 &&
      usersInfo.length > 0 &&
      messages.length > 0
    ) {
      const items = messageThreads.map((m) => {
        const otherUser = usersInfo.filter((i) => i.uid !== user.uid)[0];
        const lastMessage = messages.sort(
          (dateA, dateB) => dateB.sent_at.toDate() - dateA.sent_at.toDate()
        );
        console.log(lastMessage);

        return {
          display_name: otherUser.display_name,
          online: otherUser.online,
          photo_url: otherUser.photo_url,
          last_message: 'test'
        };
      });
      setMessageListItems(items);
    }
  }, [user, messageThreads, usersInfo, messages]);

  return (
    <div className="card-background message-list-container">
      <SearchBar />

      <div className="messages-container">
        <ul className="message-list">
          {messageListItems.map((item, index) => (
            <MessageListItem
              key={index}
              selectedMessage={selectedMessage}
              setSelectedMessage={setSelectedMessage}
              index={index}
              item={item}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MessageList;
