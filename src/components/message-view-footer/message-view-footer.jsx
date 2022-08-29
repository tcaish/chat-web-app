import { Badge, Spinner, Textarea } from 'evergreen-ui';
import { IoMdSend } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { selectSelectedMessageUserTyping } from '../../redux/slices/messagesSlice';
import './message-view-footer.scss';

function MessageViewFooter({
  inputText,
  setInputText,
  sendMessage,
  sendingMessage
}) {
  const selectedMessageUserTyping = useSelector(
    selectSelectedMessageUserTyping
  );

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
          onChange={(e) => setInputText(e.target.value)}
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
