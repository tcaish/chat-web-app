import { Spinner, Textarea } from 'evergreen-ui';
import { IoMdSend } from 'react-icons/io';
import './message-view-footer.scss';

function MessageViewFooter({
  inputText,
  setInputText,
  sendMessage,
  sendingMessage
}) {
  // const handleShiftEnter = (event) => {
  //   if (event.keyCode === 13 && event.shiftKey) {
  //     if (event.type === 'keydown') {
  //       sendMessage(inputText);
  //     }
  //   }
  // };

  // const textarea = document.querySelector('textarea');
  // console.log(textarea);
  // textarea.addEventListener('keydown', handleShiftEnter);

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
