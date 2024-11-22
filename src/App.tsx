import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleDriveUploader from './GoogleDriveUploader';

const App: React.FC = () => {
  const clientId = "1020610614752-2qurkifg2poanuh8ap5evsu8ta5kit4g.apps.googleusercontent.com"; 

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        <h1>Upload File to Google Drive</h1>
        <GoogleDriveUploader
          apiKey="AIzaSyBrw6IKkrmBG6BvzHZWFpLkiCef7DdQalg"    
          clientId={clientId}         
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
