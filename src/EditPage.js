import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './App.css';

const EditPage = () => {
  const [images, setImages] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [combinedImage, setCombinedImage] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('capturedImages')) || [];
    setImages(saved);
  }, []);

  const downloadAllImagesAsOne = async () => {
    if (!wrapperRef.current) return;

    const canvas = await html2canvas(wrapperRef.current);
    const imageData = canvas.toDataURL('image/jpeg');
    setCombinedImage(imageData);

    const link = document.createElement('a');
    link.download = 'combined-images.jpg';
    link.href = imageData;
    link.click();
  };

  const saveToDatabase = async () => {
    try {
      if (!combinedImage) {
        alert('No image to save');
        return;
      }

      const response = await axios.post('http://localhost/MY-PHOTOBOOTH-APP/src/saveImage.php', {
        image: combinedImage,
        created_at: new Date().toISOString(),
      });

      alert(response.data.message);
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  const handleWrapperClick = (e) => {
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (selectedSticker) {
      setStickers([...stickers, { emoji: selectedSticker, x, y }]);
      setSelectedSticker(null);
    } else if (currentText.trim()) {
      setTexts([...texts, { content: currentText, font: selectedFont, x, y }]);
      setCurrentText('');
    }
  };

  const [deleteMode, setDeleteMode] = useState(false);


  const handleDragEnd = (e, idx, type) => {
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (type === 'sticker') {
      const updated = [...stickers];
      updated[idx] = { ...updated[idx], x, y };
      setStickers(updated);
    } else if (type === 'text') {
      const updated = [...texts];
      updated[idx] = { ...updated[idx], x, y };
      setTexts(updated);
    }
  };

  return (
    <div className="edit-page">

    <div className="edit-container">
    <div className="left-panel">
      <h2>Edit Your Photo</h2>
  
      <label>
        Background Color:
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      </label>
  
      <div className="sticker-panel">
        <h4>Choose a Sticker</h4>
        {['❤️', '⭐', '✨', '🎀', '🌸'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => setSelectedSticker(emoji)}
            style={{
              backgroundColor: selectedSticker === emoji ? '#ffdeec' : '#fff',
              border: '1px solid #f9c',
              borderRadius: '8px',
              fontSize: '1.5rem',
              marginRight: '6px',
              cursor: 'pointer',
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
  
      <div className="text-panel">
        <h4>Add Text</h4>
        <input
          type="text"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="Enter text"
          style={{ marginRight: '10px', padding: '4px' }}
        />
        <select
          value={selectedFont}
          onChange={(e) => setSelectedFont(e.target.value)}
          style={{ padding: '4px' }}
        >
          <option value="Arial">Arial</option>
          <option value="'Comic Sans MS', cursive">Comic Sans</option>
          <option value="'Courier New', monospace">Courier</option>
          <option value="'Lucida Handwriting', cursive">Handwriting</option>
          <option value="'Brush Script MT', cursive">Brush Script</option>
        </select>
        <p style={{ fontSize: '12px', color: '#666' }}>Click on image to place text</p>
      </div>
  
      <button onClick={() => setDeleteMode(!deleteMode)}>
        {deleteMode ? 'Exit Delete Mode' : 'Delete Mode'}
      </button>
  
      <button onClick={downloadAllImagesAsOne}>Download Image</button>
      {/* <button onClick={saveToDatabase}>Save to Database</button> */}
    </div>
  
    <div className="right-panel">
      <div
        className="image-preview-wrapper-edit"
        style={{
          backgroundColor: bgColor,
          padding: '20px',
          position: 'relative',
          minHeight: '400px',
        }}
        ref={wrapperRef}
        onClick={handleWrapperClick}
      >
        {images.map((img, idx) => (
          <div key={idx} className="image-preview">
            <img className="preview-img" src={img} alt={`Edited ${idx + 1}`} />
          </div>
        ))}
  
        {stickers.map((sticker, idx) => (
          <div
            key={`s-${idx}`}
            className="sticker"
            style={{
              position: 'absolute',
              top: `${sticker.y}%`,
              left: `${sticker.x}%`,
              fontSize: '2rem',
              cursor: deleteMode ? 'pointer' : 'move',
            }}
            draggable={!deleteMode}
            onClick={() => {
              if (deleteMode) {
                const updated = [...stickers];
                updated.splice(idx, 1);
                setStickers(updated);
              }
            }}
            onDragEnd={(e) => handleDragEnd(e, idx, 'sticker')}
          >
            {sticker.emoji}
          </div>
        ))}
  
        {texts.map((text, idx) => (
          <div
            key={`t-${idx}`}
            className="text-overlay"
            style={{
              position: 'absolute',
              top: `${text.y}%`,
              left: `${text.x}%`,
              fontFamily: text.font,
              fontSize: '20px',
              color: '#333',
              cursor: deleteMode ? 'pointer' : 'move',
              whiteSpace: 'pre',
            }}
            draggable={!deleteMode}
            onClick={() => {
              if (deleteMode) {
                const updated = [...texts];
                updated.splice(idx, 1);
                setTexts(updated);
              }
            }}
            onDragEnd={(e) => handleDragEnd(e, idx, 'text')}
          >
            {text.content}
          </div>
        ))}
      </div>
    </div>
  </div>

    </div>
  );
};

export default EditPage;
