import { Avatar } from 'evergreen-ui';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timeSince } from '../../exports/functions';
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
    if (selectedMessageThread === props.item.id) {
      dispatch(setSelectedMessageUserOnline(props.item.online));
      getLastOnlineText();
    }
    // eslint-disable-next-line
  }, [props.item.online, selectedMessageThread]);

  // Returns the text to show how long it's been since the user was last online
  function getLastOnlineText() {
    const lastOnlineDate = props.item.last_online.toDate();
    const howLongAgoText = timeSince(lastOnlineDate);
    return `Last online ${howLongAgoText} ago`;
  }

  return (
    Object.keys(props.item).length > 0 && (
      <li
        className={`message-list-item-container ${
          selectedMessageThread === props.item.id && 'active'
        }`}
        onClick={() => {
          dispatch(setSelectedMessageThread(props.item.id));
          dispatch(setSelectedMessageListItem(props.item));
          props.setActiveKey && props.setActiveKey('-1');
        }}
      >
        <div className="message-content">
          <div className="message-image">
            <Avatar
              size={70}
              referrerPolicy="no-referrer"
              name={props.item.display_name ? props.item.display_name : ''}
              src={props.item.photo_url ? props.item.photo_url : ''}
              style={{ backgroundColor: props.item.photo_url && 'white' }}
            />
            <span
              className={`online-indicator ${
                props.item.online ? 'online' : 'offline'
              }`}
            ></span>
          </div>
          <div className="message-info">
            <span>{props.item.display_name}</span>
            <p className="sub-text">
              {props.item.online
                ? `${
                    props.item.display_name &&
                    props.item.display_name.split(' ')[0]
                  }
              is online`
                : getLastOnlineText()}
            </p>
            <p className="message-text">{props.item.last_message}</p>
          </div>
        </div>
      </li>
    )
  );
}

export default MessageListItem;
