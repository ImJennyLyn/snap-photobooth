// App.jsx
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const frames = [
  '/frames/frame1.png',
  '/frames/frame2.png',
  '/frames/frame3.png'
];

const App = () => {
  const webcamRefs = [useRef(null), useRef(null), useRef(null)];
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([null, null, null]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [showPreview, setShowPreview] = useState(false);

  const capture = () => {
    const newImages = webcamRefs.map(ref => ref.current.getScreenshot());
    setCapturedImages(newImages);
    setShowPreview(true);
  };

  const retake = () => {
    setCapturedImages([null, null, null]);
    setShowPreview(false);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const images = capturedImages.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    const frame = new Image();
    frame.src = selectedFrame;

    Promise.all(images.map(img => new Promise(resolve => img.onload = resolve))).then(() => {
      const width = images[0].width;
      const height = images[0].height;
      canvas.width = width;
      canvas.height = height * 3;

      images.forEach((img, i) => {
        ctx.drawImage(img, 0, height * i);
      });

      frame.onload = () => {
        ctx.drawImage(frame, 0, 0, width, height * 3);
        const link = document.createElement('a');
        link.download = 'photobooth.png';
        link.href = canvas.toDataURL();
        link.click();
      };
    });
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">React Photo Booth 📸</h1>

      <div className="grid grid-cols-1 gap-4 w-[300px] mx-auto">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative w-full h-[400px]">
            {!showPreview ? (
              <Webcam
                audio={false}
                ref={webcamRefs[i]}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover rounded border border-gray-300"
              />
            ) : (
              <img
                src={capturedImages[i]}
                alt={`Captured ${i + 1}`}
                className="w-full h-full object-cover rounded border border-gray-300"
              />
            )}
            <img
              src={selectedFrame}
              alt="frame"
              className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
            />
          </div>
        ))}
      </div>

      <div className="my-4 flex justify-center gap-2">
        {frames.map((frame, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedFrame(frame)}
            className={`p-2 border ${selectedFrame === frame ? 'border-blue-500' : 'border-gray-300'} rounded`}
          >
            Frame {idx + 1}
          </button>
        ))}
      </div>

      <div className="space-x-2">
        {!showPreview ? (
          <button onClick={capture} className="px-4 py-2 bg-green-500 text-white rounded">Capture</button>
        ) : (
          <>
            <button onClick={downloadImage} className="px-4 py-2 bg-blue-500 text-white rounded">Download</button>
            <button onClick={retake} className="px-4 py-2 bg-red-500 text-white rounded">Retake</button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default App;
