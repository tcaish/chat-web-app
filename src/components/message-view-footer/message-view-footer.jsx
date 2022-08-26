import { Spinner, Textarea } from 'evergreen-ui';
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
    </div>
  );
}

export default MessageViewFooter;
