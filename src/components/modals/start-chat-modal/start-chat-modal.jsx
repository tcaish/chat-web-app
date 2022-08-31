import { Dialog, Pane } from 'evergreen-ui';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import './start-chat-modal.scss';
import { useSelector } from 'react-redux';
import { selectUsersInfo } from '../../../redux/slices/messagesSlice';

function StartChatModal({ showModal, setShowModal }) {
  const usersInfo = useSelector(selectUsersInfo);

  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);

  // Sets the options for the select input field
  useEffect(() => {
    if (usersInfo.length > 0) {
      const tempOptions = usersInfo.map((u) => {
        return {
          value: u.uid,
          label: u.display_name
        };
      });
      setOptions(tempOptions);
    }
  }, [usersInfo]);

  // Handles what happens when confirm button is pressed
  function handleConfirm() {
    if (!selectedOption) return;

    setShowModal(false);
  }

  return (
    <Pane>
      <Dialog
        minHeightContent={230}
        isShown={showModal}
        title="Start a New Conversation"
        onCloseComplete={() => setShowModal(false)}
        preventBodyScrolling
        confirmLabel={
          selectedOption
            ? `Start Chat with ${selectedOption.label.split(' ')[0]}`
            : 'Start Chat'
        }
        onConfirm={handleConfirm}
        isConfirmDisabled={selectedOption ? false : true}
      >
        <p>Search for a user to start a new conversation below:</p>

        <Select
          openMenuOnClick={false}
          placeholder="Search for a user..."
          maxMenuHeight={150}
          inputValue={searchInputValue}
          onInputChange={(e) => setSearchInputValue(e)}
          onChange={(e) => setSelectedOption(e)}
          isClearable={true}
          options={options}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null
          }}
        />
      </Dialog>
    </Pane>
  );
}

export default StartChatModal;
