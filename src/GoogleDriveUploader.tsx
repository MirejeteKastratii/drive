import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';

interface GoogleDriveUploaderProps {
  apiKey: string;
  clientId: string;
}

const GoogleDriveUploader: React.FC<GoogleDriveUploaderProps> = ({ apiKey, clientId }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);



  useEffect(() => {
    console.log('GoogleDriveUploader component mounted');

    const loadGoogleIdentityScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        console.log('Google Identity Services script loaded');
      };
      script.onerror = (error) => {
        console.error('Failed to load Google Identity Services script:', error);
      };
      document.head.appendChild(script);
    };

    loadGoogleIdentityScript();
  }, []);

  useEffect(() => {
    console.log('useEffect for initializing Google Identity Services');
    if (window.google && window.google.accounts) {
      console.log('Initializing Google accounts ID with client ID:', clientId);
      window.google.accounts.id.initialize({
        client_id: clientId,
      });
    }
  }, [clientId]);

  const handleLoginSuccess = (response: any) => {
    console.log('Login success response:', response);
    const token = response.credential; // OAuth token
    setAccessToken(token);
    setIsAuthenticated(true);
    console.log('Access token set:', token);
  };

  const handleLoginFailure = (error: any) => {
    console.error('Login failed:', error);
    setIsAuthenticated(false);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
      setAccessToken(null);
      setIsAuthenticated(false);
    }
    console.log('Logged out, access token reset.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
  
    if (!file) {
      console.log('No file selected. Exiting.');
      return;
    }
  
    if (!accessToken) {
      console.log('No access token available. Exiting.');
      return;
    }
  
    const metadata = {
      name: file.name,
      mimeType: file.type,
    };
    console.log('File metadata:', metadata);
  
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    console.log('Form data prepared for upload:', form);

    const encodedAccessToken = encodeURIComponent('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'); 
  
    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({
        Authorization: `Bearer ${encodedAccessToken}`, // Correct format with 'Bearer' prefix
      }),
      body: form,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded successfully:', data);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };
  

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginFailure} />
          {console.log('GoogleLogin component rendered')}
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Sign Out</button>
          <input type="file" onChange={handleFileUpload} />
        </div>
      )}
    </div>
  );
};

export default GoogleDriveUploader;
