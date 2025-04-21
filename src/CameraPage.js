import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import './App.css';

const CameraPage = () => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const navigate = useNavigate();

  const capture = () => {
    if (webcamRef.current && capturedImages.length < 3) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImages((prev) => [...prev, imageSrc]);
    }
  };

  const retake = () => {
    setCapturedImages([]);
  };

  const handleNext = () => {
    // Save to local storage or context for EditPage to access
    localStorage.setItem('capturedImages', JSON.stringify(capturedImages));
    navigate('/edit');
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="camera-section">
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam"
            />
          </div>
          <div className="button-group">
            <button
              onClick={capture}
              disabled={capturedImages.length >= 3}
              className={`button capture-button ${
                capturedImages.length >= 3 ? 'disabled' : ''
              }`}
            >
              Capture
            </button>
            <button onClick={retake} className="button retake-button">
              Retake
            </button>
            {capturedImages.length === 3 && (
              <button onClick={handleNext} className="button next-button">
                Next
              </button>
            )}
          </div>
        </div>

        <div className="image-preview-wrapper">
          <div className="images-section">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="image-preview">
                {capturedImages[idx] && (
                  <img
                    src={capturedImages[idx]}
                    alt={`Captured ${idx + 1}`}
                    className="preview-img"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
