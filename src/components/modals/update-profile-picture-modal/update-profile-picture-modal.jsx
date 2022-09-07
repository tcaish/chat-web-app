import { Dialog, Pane } from 'evergreen-ui';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TOAST_TYPES } from '../../../exports/contants';
import {
  canUploadNewProfilePicture,
  showToast
} from '../../../exports/functions';
import { selectScreenWidth } from '../../../redux/slices/screenSlice';
import { selectUser, setPhotoURL } from '../../../redux/slices/userSlice';
import { uploadProfilePicture } from '../../../utils/firebase/firebase-adders';
import FileUploaderSingleUploadDemo from '../../file-uploader/file-uploader';
import './update-profile-picture-modal.scss';

function UpdateProfilePictureModal({ showModal, setShowModal }) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const screenWidth = useSelector(selectScreenWidth);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handles uploading the new profile pricture
  async function handleConfirm() {
    if (files.length !== 1) return;

    setLoading(true);

    await uploadProfilePicture(user.uid, files[0]).then((res) => {
      if (res.added) {
        dispatch(setPhotoURL(res.url));
        setShowModal(false);

        showToast('Profile Picture Updated');
      } else {
        showToast(
          'Upload Failed',
          'There was an error updating your profile picture. Try again later!',
          TOAST_TYPES.danger
        );
      }

      setLoading(false);
    });
  }

  return (
    <Pane>
      <Dialog
        topOffset={screenWidth <= 991 ? 115 : 150}
        isShown={showModal}
        title="Upload New Profile Picture"
        onCloseComplete={() => setShowModal(false)}
        preventBodyScrolling
        confirmLabel="Upload"
        onConfirm={handleConfirm}
        isConfirmDisabled={!canUploadNewProfilePicture(user)}
        isConfirmLoading={loading}
      >
        <FileUploaderSingleUploadDemo
          files={files}
          setFiles={setFiles}
          loading={loading}
        />
      </Dialog>
    </Pane>
  );
}

export default UpdateProfilePictureModal;
