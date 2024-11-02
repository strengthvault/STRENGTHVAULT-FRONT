// Frontend (React) - usa fetch API para la subida directa
import React, { useState } from 'react';

const VimeoUploader = () => {
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const uploadToVimeo = async () => {
    if (!videoFile) return alert('Please select a video first');
    
    try {
      // Paso 1: Solicita una URL de carga al servidor backend
      const response = await fetch('http://localhost:3000/api/vimeo/request-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoName: videoFile.name }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
    
      const { uploadUrl } = await response.json();

      // Paso 2: Subir el archivo de video a Vimeo directamente desde el cliente
      const videoUploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': videoFile.type },
        body: videoFile,
      });

      if (videoUploadResponse.ok) {
        alert('Video uploaded successfully to Vimeo');
      } else {
        throw new Error('Failed to upload video to Vimeo');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video, check console for details');
    }
  };
  
  

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={uploadToVimeo}>Upload to Vimeo</button>
    </div>
  );
};

export default VimeoUploader;
