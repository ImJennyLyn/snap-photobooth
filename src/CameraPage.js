import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import './App.css';

const CameraPage = () => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [countdown, setCountdown] = useState(3); // Countdown from 3 seconds
  const [isCapturing, setIsCapturing] = useState(false); // Track if capturing is in progress
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;

    if (isCapturing && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1); // Decrease countdown every second
      }, 1000);
    } else if (countdown === 0) {
      // Capture the photo when countdown hits 0
      capture();
    }

    return () => clearInterval(interval); // Cleanup the interval when countdown ends or when the component unmounts
  }, [isCapturing, countdown]);

  const capture = () => {
    if (webcamRef.current && capturedImages.length < 3) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImages((prev) => [...prev, imageSrc]);
      setIsCapturing(false); // Stop the countdown and capturing process
      setCountdown(3); // Reset the countdown for the next shot
    }
  };

  const startCapture = () => {
    if (capturedImages.length < 3) {
      setIsCapturing(true); // Start the countdown and capturing process
    }
  };

  const retake = () => {
    setCapturedImages([]);
    setCountdown(3); // Reset the countdown when retaking
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
            {isCapturing && (
              <div className="countdown">
                <p>{countdown}</p> {/* Display the countdown timer */}
              </div>
            )}
          </div>
          <div className="button-group">
            <button
              onClick={startCapture}
              disabled={capturedImages.length >= 3 || isCapturing}
              className={`button capture-button ${
                capturedImages.length >= 3 || isCapturing ? 'disabled' : ''
              }`}
            >
              Capture
            </button>
            <button onClick={retake} className="button retake-button">
              Retake
            </button>
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

        <div className="next-button-wrapper">
          <button
            onClick={handleNext}
            className={`button next-button ${capturedImages.length === 3 ? '' : 'disabled'}`}
            disabled={capturedImages.length < 3}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
