import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './App.css';

const EditPage = () => {
  const [images, setImages] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [combinedImage, setCombinedImage] = useState(null); // State to hold the combined image
  const wrapperRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('capturedImages')) || [];
    setImages(saved);
  }, []);

  const downloadAllImagesAsOne = async () => {
    if (!wrapperRef.current) return;

    const canvas = await html2canvas(wrapperRef.current);
    const imageData = canvas.toDataURL('image/jpeg'); // Get the base64 data URL

    // Set the combined image in state
    setCombinedImage(imageData);

    const link = document.createElement('a');
    link.download = 'combined-images.jpg';
    link.href = imageData; // Use the generated base64 image data
    link.click();
  };

  const saveToDatabase = async () => {
    try {
      // Ensure combinedImage is a base64 string and not empty
      if (!combinedImage) {
        alert('No image to save');
        return;
      }

      const response = await axios.post('http://localhost/MY-PHOTOBOOTH-APP/src/saveImage.php', {
        image: combinedImage,  // The base64 encoded image data
        created_at: new Date().toISOString(),  // Timestamp when image was taken
      });

      alert(response.data.message);
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  return (
    <div>
      <h2>Edit Preview</h2>
      <label>
        Background Color:
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      </label>

      <div
        className="image-preview-wrapper"
        style={{ backgroundColor: bgColor, padding: '20px' }}
        ref={wrapperRef}
      >
        {images.map((img, idx) => (
          <div key={idx} className="image-preview">
            <img className="preview-img" src={img} alt={`Edited ${idx + 1}`} />
          </div>
        ))}
      </div>

      <button onClick={downloadAllImagesAsOne}>Download All as One Image</button>
      <button onClick={saveToDatabase}>Save to Database</button>
    </div>
  );
};

export default EditPage;
