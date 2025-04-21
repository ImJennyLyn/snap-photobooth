import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CameraPage from './CameraPage.js';
import EditPage from './EditPage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<CameraPage />} />
        <Route path="/edit" element={<EditPage />} />
      </Routes>
    </Router>
  );
}

export default App;
