import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import './App.css'; // Import the CSS file

const App = () => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);

  const capture = () => {
    if (webcamRef.current && capturedImages.length < 3) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImages((prev) => [...prev, imageSrc]);
    }
  };

  const retake = () => {
    setCapturedImages([]);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Left: Camera + Buttons */}
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
          </div>
        </div>

        {/* Right: Captured Images */}
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
  );
};

export default App;
