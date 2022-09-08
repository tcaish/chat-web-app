import { Badge, Spinner, Textarea } from 'evergreen-ui';
import { useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { selectSelectedMessageUserTyping } from '../../redux/slices/messagesSlice';
import { selectScreenWidth } from '../../redux/slices/screenSlice';
import { selectUser } from '../../redux/slices/userSlice';
import { editMessageThreadUsersTyping } from '../../utils/firebase/firebase-modifiers';
import './message-view-footer.scss';

function MessageViewFooter(props) {
  const user = useSelector(selectUser);
  const selectedMessageUserTyping = useSelector(
    selectSelectedMessageUserTyping
  );
  const screenWidth = useSelector(selectScreenWidth);

  const [updatedUserTyping, setUpdatedUserTyping] = useState(false);

  // Handles the input from the user when typing in the textarea
  function handleUserTyping(e) {
    const text = e.target.value;

    props.setInputText(e.target.value);

    // If there is text in the textarea and we have not updated database yet,
    // update database with user typing
    if (text && !updatedUserTyping) {
      setUpdatedUserTyping(true);
      editMessageThreadUsersTyping(props.messageThreadId, user.uid, true);
    }
    // Else if there is no text in the textarea, and we have updated the
    // database, remove typing user from database
    else if (!text && updatedUserTyping) {
      setUpdatedUserTyping(false);
      editMessageThreadUsersTyping(props.messageThreadId, user.uid, false);
    }
  }

  return (
    <div className="message-view-footer-container">
      <div className="message-view-footer-typing-container  message-view-footer-text">
        <p>
          {selectedMessageUserTyping &&
            `${selectedMessageUserTyping} is typing...`}
        </p>
      </div>
      <div className="message-view-footer-input-container">
        <Textarea
          className="message-view-footer-input"
          placeholder="Write a message..."
          disabled={props.sendingMessage}
          value={props.inputText}
          autoFocus={true}
          onChange={(e) => handleUserTyping(e)}
          onKeyDown={(event) => {
            // Send message when SHIFT + ENTER pressed
            if (event.keyCode === 13 && event.shiftKey) {
              if (event.type === 'keydown') {
                props.sendMessage(props.inputText);
                setUpdatedUserTyping(false);
              }
            }
          }}
        />
        <div
          className="message-view-footer-send-container"
          onClick={() => {
            props.sendMessage(props.inputText);
            setUpdatedUserTyping(false);
          }}
        >
          <span className="send-button">
            {!props.sendingMessage ? <IoMdSend /> : <Spinner size={24} />}
          </span>
        </div>
      </div>
      <div className="message-view-footer-message-container message-view-footer-text">
        <p>
          {screenWidth > 991 && (
            <>
              <Badge color="neutral" marginRight={6}>
                Shift
              </Badge>
              +
              <Badge color="neutral" marginLeft={6} marginRight={6}>
                Enter
              </Badge>
              to send message
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default MessageViewFooter;
