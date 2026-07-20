import { useState } from "react";

function PhotoUpload({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedFile && (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Önizleme"
          width={200}
        />
      )}
    </div>
  );
}

export default PhotoUpload;