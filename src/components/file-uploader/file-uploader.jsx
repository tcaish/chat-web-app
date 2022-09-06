import { FileCard, FileUploader, Pane } from 'evergreen-ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { canUploadNewProfilePicture } from '../../exports/functions';
import { selectUser } from '../../redux/slices/userSlice';

function FileUploaderSingleUploadDemo({ files, setFiles, loading }) {
  const user = useSelector(selectUser);

  const [fileRejections, setFileRejections] = useState([]);

  const handleChange = (files) => setFiles([files[0]]);
  const handleRejected = (fileRejections) =>
    setFileRejections([fileRejections[0]]);
  const handleRemove = () => {
    setFiles([]);
    setFileRejections([]);
  };

  // Returns the description placed in the file uploader component
  function fileUploaderDescription() {
    if (canUploadNewProfilePicture(user)) {
      return 'You can upload one picture 1 MB or less in size and must be .jpg, .jpeg, or .png.';
    }

    return 'You are signed in via a provider, so you cannot update your profile picture here.';
  }

  return (
    <Pane>
      <FileUploader
        label="Upload File"
        description={fileUploaderDescription()}
        maxSizeInBytes={1 * 1024 ** 2}
        maxFiles={1}
        acceptedMimeTypes={['image/jpeg', 'image/png']}
        onChange={handleChange}
        onRejected={handleRejected}
        disabled={loading || !canUploadNewProfilePicture(user)}
        renderFile={(file) => {
          const { name, size, type } = file;
          const fileRejection = fileRejections.find(
            (fileRejection) => fileRejection.file === file
          );
          const { message } = fileRejection || {};
          return (
            <FileCard
              key={name}
              isInvalid={fileRejection != null}
              name={name}
              onRemove={handleRemove}
              sizeInBytes={size}
              type={type}
              validationMessage={message}
              disabled={loading}
            />
          );
        }}
        values={files}
      />
    </Pane>
  );
}

export default FileUploaderSingleUploadDemo;
