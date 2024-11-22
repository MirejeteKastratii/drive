// Drive.ts
class GoogleDriveService {
  private static clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;  // OAuth client ID from Google Cloud Console
  private static scopes = import.meta.env.VITE_GOOGLE_SCOPES;  // Scopes for Google Drive API

  // Initialize Google Identity Services (GIS)
  static initialize = () => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client'; // Google Identity Services script
    script.onload = () => {
      console.log('Google Identity Services Loaded');
    };
    document.body.appendChild(script);
  };

  // Handle user sign-in with GIS
  static signIn = () => {
    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleLoginSuccess,
    });

    // Trigger the login prompt
    window.google.accounts.id.prompt();
  };

  // Handle successful login
  static handleLoginSuccess = (response: any) => {
    console.log('Login successful', response);
    const token = response.credential;  // ID token for authentication
    console.log('ID Token:', token);
    // You can store the token for later use in API requests
  };

  // Handle user sign-out
  static signOut = () => {
    window.google.accounts.id.disableAutoSelect();
    console.log('User signed out');
  };

  // Upload a file to Google Drive
  static uploadFile = async (file: File) => {
    const token = 'YOUR_ID_TOKEN';  // Replace with actual token received after sign-in

    const metadata = {
      name: file.name,
      mimeType: file.type,
    };

    const form = new FormData();
    form.append('file', file);

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        body: form,
      }
    );

    const data = await response.json();
    console.log('File uploaded:', data);
    return data;
  };
}

export default GoogleDriveService;
