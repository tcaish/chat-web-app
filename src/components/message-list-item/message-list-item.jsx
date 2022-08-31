import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSelectedMessageThread,
  setSelectedMessageListItem,
  setSelectedMessageThread,
  setSelectedMessageUserOnline
} from '../../redux/slices/messagesSlice';
import './message-list-item.scss';

function MessageListItem(props) {
  const dispatch = useDispatch();

  const selectedMessageThread = useSelector(selectSelectedMessageThread);

  // Setting the user's online status for the message thread that's selected
  useEffect(() => {
    if (selectedMessageThread === props.item.id)
      dispatch(setSelectedMessageUserOnline(props.item.online));
    // eslint-disable-next-line
  }, [props.item.online, selectedMessageThread]);

  return (
    Object.keys(props.item).length > 0 && (
      <li
        className={`message-list-item-container ${
          selectedMessageThread === props.item.id && 'active'
        }`}
        onClick={() => {
          dispatch(setSelectedMessageThread(props.item.id));
          dispatch(setSelectedMessageListItem(props.item));
        }}
      >
        <div className="message-content">
          <div className="message-image">
            <img src={props.item.photo_url} alt="profile" />
            <span className={props.item.online ? 'online' : 'offline'}></span>
          </div>
          <div className="message-info">
            <span>{props.item.display_name}</span>
            <p className="sub-text">
              {props.item.display_name && props.item.display_name.split(' ')[0]}{' '}
              is {props.item.online ? 'online' : 'offline'}
            </p>
            <p className="message-text">{props.item.last_message}</p>
          </div>
        </div>
      </li>
    )
  );
}

export default MessageListItem;
