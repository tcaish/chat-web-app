import { Placeholder } from 'react-bootstrap';
import PlaceholderImg from '../../assets/images/placeholder_img.gif';
import '../message-list-item/message-list-item.scss';
import './message-list-item-placeholder.scss';

function MessageListItemPlaceholder() {
  return (
    <li className="message-list-item-container">
      <div className="message-content">
        <div className="message-image">
          <img src={PlaceholderImg} alt="profile" />
        </div>
        <div className="message-info">
          <Placeholder as="p" animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
          <Placeholder className="sub-text" as="p" animation="glow">
            <Placeholder xs={4} size="xs" />
          </Placeholder>
          <Placeholder className="message-text" as="p" animation="glow">
            <Placeholder xs={8} size="sm" />
          </Placeholder>
        </div>
      </div>
    </li>
  );
}

export default MessageListItemPlaceholder;
