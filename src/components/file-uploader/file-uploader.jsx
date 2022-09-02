import { FileCard, FileUploader, Pane } from 'evergreen-ui';
import React, { useState } from 'react';

function FileUploaderSingleUploadDemo({ files, setFiles }) {
  const [fileRejections, setFileRejections] = useState([]);

  const handleChange = (files) => setFiles([files[0]]);
  const handleRejected = (fileRejections) =>
    setFileRejections([fileRejections[0]]);
  const handleRemove = () => {
    setFiles([]);
    setFileRejections([]);
  };

  return (
    <Pane>
      <FileUploader
        label="Upload File"
        description="You can upload one picture 1 MB or less in size and must be .jpg, .jpeg, or .png."
        maxSizeInBytes={1 * 1024 ** 2}
        maxFiles={1}
        acceptedMimeTypes={['image/jpeg', 'image/png']}
        onChange={handleChange}
        onRejected={handleRejected}
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
            />
          );
        }}
        values={files}
      />
    </Pane>
  );
}

export default FileUploaderSingleUploadDemo;
