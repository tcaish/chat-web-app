import { MdMessage } from 'react-icons/md';
import './empty-state.scss';

function EmptyState() {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-container">
        <span className="gradient-background empty-state-color">
          <MdMessage />
        </span>
      </div>

      <div className="empty-state-title-container">
        <h3 className="empty-state-color">No Conversation to Display</h3>
      </div>

      <div>
        <p className="empty-state-color">
          Select a message from the left to pick up from a previous conversation
          or start a new one!
        </p>
      </div>
    </div>
  );
}

export default EmptyState;
