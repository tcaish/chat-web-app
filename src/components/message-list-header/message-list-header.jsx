import SearchBar from '../search-bar/search-bar';
import { IoMdAddCircle } from 'react-icons/io';
import './message-list-header.scss';

function MessageListHeader() {
  return (
    <div className="message-list-header-container">
      <SearchBar />
      <IoMdAddCircle className="message-list-header-add-icon" />
    </div>
  );
}

export default MessageListHeader;
