import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './App.css';

const EditPage = () => {
  const [images, setImages] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('capturedImages')) || [];
    setImages(saved);
  }, []);

  const downloadAllImagesAsOne = async () => {
    if (!wrapperRef.current) return;

    const canvas = await html2canvas(wrapperRef.current);
    const link = document.createElement('a');
    link.download = 'combined-images.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  };

  const saveToDatabase = async () => {
    const response = await axios.post('http://localhost/your-project/php/saveImage.php', {
      images,
    });
    alert(response.data.message);
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
            <img   className="preview-img"
              src={img}
              alt={`Edited ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      <button onClick={downloadAllImagesAsOne}>Download All as One Image</button>
      <button onClick={saveToDatabase}>Save to Database</button>
    </div>
  );
};

export default EditPage;
