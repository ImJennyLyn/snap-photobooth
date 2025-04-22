import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './App.css';

const EditPage = () => {
  const [images, setImages] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const wrapperRef = useRef(null);

  // Load captured images from localStorage on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('capturedImages')) || [];
    setImages(saved);
  }, []);

  // Download all images as one canvas-rendered image
  const downloadAllImagesAsOne = async () => {
    if (!wrapperRef.current) return;

    const canvas = await html2canvas(wrapperRef.current);
    const link = document.createElement('a');
    link.download = 'combined-images.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  };

  // Save the single combined image and timestamp to PHP backend
  const saveToDatabase = async () => {
    if (!wrapperRef.current) return;

    const canvas = await html2canvas(wrapperRef.current);
    const dataUrl = canvas.toDataURL('image/jpeg');

    try {
      const response = await axios.post('http://localhost/your-project/php/saveImage.php', {
        image: dataUrl,
        created_at: new Date().toISOString()
      });
      alert(response.data.message);
    } catch (error) {
      alert('Failed to save image: ' + error.message);
    }
  };

  return (
    <div className="edit-page">
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
        style={{ backgroundColor: bgColor, padding: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}
        ref={wrapperRef}
      >
        {images.map((img, idx) => (
          <div key={idx} className="image-preview">
            <img
              className="preview-img"
              src={img}
              alt={`Edited ${idx + 1}`}
              style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={downloadAllImagesAsOne}>Download All as One Image</button>
        <button onClick={saveToDatabase} style={{ marginLeft: '10px' }}>
          Save to Database
        </button>
      </div>
    </div>
  );
};

export default EditPage;
