import { Badge, Spinner, Textarea } from 'evergreen-ui';
import { IoMdSend } from 'react-icons/io';
import './message-view-footer.scss';

function MessageViewFooter({
  inputText,
  setInputText,
  sendMessage,
  sendingMessage
}) {
  return (
    <div className="message-view-footer-container">
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
      <div className="message-view-footer-message-container">
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
