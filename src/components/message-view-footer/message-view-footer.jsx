import { Badge, Spinner, Textarea } from 'evergreen-ui';
import { useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { selectSelectedMessageUserTyping } from '../../redux/slices/messagesSlice';
import { selectUser } from '../../redux/slices/userSlice';
import { editMessageThreadUsersTyping } from '../../utils/firebase/firebase-modifiers';
import './message-view-footer.scss';

function MessageViewFooter({
  messageThreadId,
  inputText,
  setInputText,
  sendMessage,
  sendingMessage
}) {
  const user = useSelector(selectUser);
  const selectedMessageUserTyping = useSelector(
    selectSelectedMessageUserTyping
  );

  const [updatedUserTyping, setUpdatedUserTyping] = useState(false);

  // Handles the input from the user when typing in the textarea
  function handleUserTyping(e) {
    const text = e.target.value;

    setInputText(e.target.value);

    // If there is text in the textarea and we have not updated database yet,
    // update database with user typing
    if (text && !updatedUserTyping) {
      setUpdatedUserTyping(true);
      editMessageThreadUsersTyping(messageThreadId, user.uid, true);
    }
    // Else if there is no text in the textarea, and we have updated the
    // database, remove typing user from database
    else if (!text && updatedUserTyping) {
      setUpdatedUserTyping(false);
      editMessageThreadUsersTyping(messageThreadId, user.uid, false);
    }
  }

  return (
    <div className="message-view-footer-container">
      <div className="message-view-footer-typing-container  message-view-footer-text">
        {selectedMessageUserTyping && (
          <p>{selectedMessageUserTyping} is typing...</p>
        )}
      </div>
      <div className="message-view-footer-input-container">
        <Textarea
          className="message-view-footer-input"
          placeholder="Write a message..."
          disabled={sendingMessage}
          value={inputText}
          onChange={(e) => handleUserTyping(e)}
          onKeyDown={(event) => {
            // Send message when SHIFT + ENTER pressed
            if (event.keyCode === 13 && event.shiftKey) {
              if (event.type === 'keydown') {
                sendMessage(inputText);
              }
            }
          }}
        />
        <div
          className="message-view-footer-send-container"
          onClick={() => sendMessage(inputText)}
        >
          <span className="send-button">
            {!sendingMessage ? <IoMdSend /> : <Spinner size={24} />}
          </span>
        </div>
      </div>
      <div className="message-view-footer-message-container message-view-footer-text">
        <p>
          <Badge color="neutral" marginRight={6}>
            Shift
          </Badge>
          +
          <Badge color="neutral" marginLeft={6} marginRight={6}>
            Enter
          </Badge>
          to send message
        </p>
      </div>
    </div>
  );
}

export default MessageViewFooter;
