import React from 'react';
import UploadForm from './components/UploadForm.jsx';
import './index.css'; // Global styles for the dark green glassmorphic theme

function App() {
  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="text-section">
          <div className="badge">
            <span className="avatars"><a href='https://github.com/LeadWithAnkit'>🧑‍💻👩‍💻👨‍💻</a></span> Join community of 1k+ developers
          </div>
          <h1>
            Ready to <br />
            Transform Your <br />
            <span className="highlight">Digital Experience?</span>
          </h1>
          <p>
            Let our automation craft an email experience that elevates your workflow and targets your audience. Upload your resume and mailing list today.
          </p>
        </div>
        <div className="form-section">
          <UploadForm />
        </div>
      </div>
    </div>
  );
}

export default App;