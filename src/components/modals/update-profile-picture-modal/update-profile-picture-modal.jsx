import { Dialog, Pane } from 'evergreen-ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { canUploadNewProfilePicture } from '../../../exports/functions';
import { selectUser } from '../../../redux/slices/userSlice';
import FileUploaderSingleUploadDemo from '../../file-uploader/file-uploader';
import './update-profile-picture-modal.scss';

function UpdateProfilePictureModal({ showModal, setShowModal }) {
  const user = useSelector(selectUser);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    console.log('uploading picture');
    // setLoading(true);
  }

  return (
    <Pane>
      <Dialog
        isShown={showModal}
        title="Upload New Profile Picture"
        onCloseComplete={() => setShowModal(false)}
        preventBodyScrolling
        confirmLabel="Upload"
        onConfirm={handleConfirm}
        isConfirmDisabled={!canUploadNewProfilePicture(user)}
        isConfirmLoading={loading}
      >
        <FileUploaderSingleUploadDemo files={files} setFiles={setFiles} />
      </Dialog>
    </Pane>
  );
}

export default UpdateProfilePictureModal;
