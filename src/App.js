import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const App = () => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);

  const capture = () => {
    if (
      webcamRef.current &&
      capturedImages.length < 3
    ) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImages((prev) => [...prev, imageSrc]);
    }
  };

  const retake = () => {
    setCapturedImages([]);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white p-10">
      <div className="flex gap-8 items-start">
        {/* Left: Camera + Buttons */}
        <div className="flex flex-col items-center">
          {/* Camera */}
          <div className="w-[320px] h-[240px] bg-gray-300 border border-gray-500 rounded overflow-hidden mb-4 relative">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={capture}
              disabled={capturedImages.length >= 3}
              className={`px-4 py-2 border rounded ${
                capturedImages.length >= 3
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-200 hover:bg-red-300'
              }`}
            >
              Capture
            </button>
            <button
              onClick={retake}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 border rounded"
            >
              Retake
            </button>
          </div>
        </div>

        {/* Right: Captured Images */}
        <div className="flex flex-col gap-4 h-[240px] overflow-y-auto">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="w-[320px] h-[70px] bg-gray-100 border border-gray-400 rounded overflow-hidden"
            >
              {capturedImages[idx] && (
                <img
                  src={capturedImages[idx]}
                  alt={`Captured ${idx + 1}`}
                  className="w-full h-full object-cover"
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
