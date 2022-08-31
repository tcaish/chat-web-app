import SearchBar from '../search-bar/search-bar';
import { IoMdAddCircle } from 'react-icons/io';
import './message-list-header.scss';
import { useState } from 'react';
import StartChatModal from '../modals/start-chat-modal/start-chat-modal';

function MessageListHeader() {
  const [showModal, setShowModal] = useState(false);

  // Handles opening the modal to search for user to start new conversation
  function handleAddButtonClicked() {
    setShowModal(true);
  }

  return (
    <>
      <div className="message-list-header-container">
        <SearchBar />
        <IoMdAddCircle
          className="message-list-header-add-icon"
          onClick={handleAddButtonClicked}
        />
      </div>

      {showModal && (
        <StartChatModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </>
  );
}

export default MessageListHeader;
