import { Form, InputGroup } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import './search-bar.scss';

function SearchBar() {
  return (
    <div className="search-bar-container">
      <InputGroup>
        <InputGroup.Text className="search-bar-input-icon-container">
          <BsSearch />
        </InputGroup.Text>
        <Form.Control
          className="search-bar-input"
          placeholder="Search..."
          aria-label="Search"
        />
      </InputGroup>
    </div>
  );
}

export default SearchBar;
