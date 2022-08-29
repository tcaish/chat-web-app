import { MdMessage } from 'react-icons/md';
import './empty-state.scss';

function EmptyState() {
  return (
    <div className="empty-state-container">
      <div>
        <MdMessage />
      </div>
      <div>
        <h3>No Conversation to Display</h3>
      </div>
      <div>
        <p>
          Select a message from the left to pick up from a previous conversation
          or start a new one!
        </p>
      </div>
    </div>
  );
}

export default EmptyState;
