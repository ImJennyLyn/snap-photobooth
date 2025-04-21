import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const EditPage = () => {
  const [images, setImages] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('capturedImages')) || [];
    setImages(saved);
  }, []);

  const downloadImage = (image, index) => {
    const a = document.createElement('a');
    a.href = image;
    a.download = `image${index + 1}.jpg`;
    a.click();
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
      <div className="image-preview-wrapper" style={{ backgroundColor: bgColor }}>
        {images.map((img, idx) => (
          <div key={idx} className="image-preview">
            <img src={img} alt={`Edited ${idx + 1}`} style={{ maxWidth: '100px' }} />
            <button onClick={() => downloadImage(img, idx)}>Download</button>
          </div>
        ))}
      </div>
      <button onClick={saveToDatabase}>Save to Database</button>
    </div>
  );
};

export default EditPage;
