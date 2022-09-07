import { Dialog, Pane } from 'evergreen-ui';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import './start-chat-modal.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMessageThreads,
  selectUsersInfo,
  setMessageThreads,
  setSelectedMessageListItem,
  setSelectedMessageThread,
  setSelectedMessageUserOnline
} from '../../../redux/slices/messagesSlice';
import { selectUser } from '../../../redux/slices/userSlice';
import { addNewMessageThread } from '../../../utils/firebase/firebase-adders';
import { selectScreenWidth } from '../../../redux/slices/screenSlice';
import { showToast } from '../../../exports/functions';
import { TOAST_TYPES } from '../../../exports/contants';

function StartChatModal({ showModal, setShowModal }) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const usersInfo = useSelector(selectUsersInfo);
  const messageThreads = useSelector(selectMessageThreads);
  const screenWidth = useSelector(selectScreenWidth);

  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sets the options for the select input field
  useEffect(() => {
    if (usersInfo.length > 0) {
      const tempOptions = usersInfo.reduce((result, u) => {
        if (u.uid !== user.uid) {
          result.push({
            value: u.uid,
            label: u.display_name
          });
        }

        return result;
      }, []);
      setOptions(tempOptions);
    }
    // eslint-disable-next-line
  }, [usersInfo]);

  // Handles what happens when confirm button is pressed
  async function handleConfirm() {
    if (!selectedOption) return;

    if (isMessageThreadAlreadyCreated()) {
      showToast(
        `Chat Already Started with ${selectedOption.label}`,
        '',
        TOAST_TYPES.warning
      );
      return;
    }

    setLoading(true);

    const otherUser = usersInfo.filter(
      (u) => u.uid === selectedOption.value
    )[0];
    const userUids = [user.uid, otherUser.uid];

    await addNewMessageThread(userUids).then((res) => {
      if (res.added) {
        dispatch(setMessageThreads([res.data, ...messageThreads]));
        dispatch(setSelectedMessageUserOnline(otherUser.online));
        dispatch(setSelectedMessageThread(res.data.id));
        dispatch(
          setSelectedMessageListItem({
            display_name: selectedOption.label,
            id: res.data.id,
            last_message: '',
            messages: [],
            online: otherUser.online,
            photo_url: otherUser.photo_url,
            user_uid: otherUser.uid
          })
        );

        showToast(`Chat Started with ${selectedOption.label}`);

        setShowModal(false);
      } else {
        showToast(
          'Failed to Start Chat',
          `There was an error starting a chat with ${selectedOption.label}. Please try again later!`,
          TOAST_TYPES.danger
        );
      }

      setLoading(false);
    });
  }

  // Checks if the user already has a message thread open with the chosen user
  // to chat with
  function isMessageThreadAlreadyCreated() {
    const currentlyChattingWithTheseUsers = [
      ...new Set(
        messageThreads.reduce((prev, cur) => prev.concat(cur.users), [])
      )
    ];

    return currentlyChattingWithTheseUsers.includes(selectedOption.value);
  }

  return (
    <Pane>
      <Dialog
        topOffset={screenWidth <= 991 ? 115 : 150}
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
        isConfirmLoading={loading}
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
