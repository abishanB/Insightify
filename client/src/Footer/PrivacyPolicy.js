import React from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PrivacyPolicy(){
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="policy-container">
      <h4>Privacy Policy</h4>
      <p>
      This Privacy Policy describes how Insightify collects, uses and/or maintains certain information. By using Insightify, you agree to the terms set forth in this Privacy Policy.
      </p>

      <h6>Data Collection </h6>
      <p>   
        We gather your information directly through the Spotify Web API. To provide our service, we access your top tracks, top artists, your user profile, and your saved playlists. 
        <br></br><br></br>
        Insightify does not use cookies, tracking technologies, or any third-party analytics tools to collect user data.
        <br></br><br></br>
        If you wish to revoke access to your Spotify account, please follow the process outlined here,&nbsp;
        <a href="https://support.spotify.com/au/article/spotify-on-other-apps/" target="_blank" rel="noopener noreferrer">
          https://support.spotify.com/
        </a>
      </p>

      <h6>Data Storage</h6>
      <p>
        We may temporarily store your user ID and playlist information to efficent processing.
        <br></br><br></br>
        This data is stored in a database accessible only to Insightify and is automatically deleted after 7 days.
      </p>

      <h6>Data Sharing</h6>
      <p>
      We do not share, sell, or rent your personal data to any third parties.
      <br></br><br></br>
      We do not share your data for any marketing purposes or with any external organizations.
      </p>

      <h6>Contact</h6>
      <p>
      If you have any questions about this Privacy Policy you can contact us at&nbsp;
      <a href="mailto:insightifyhq@gmail.com" target="_blank" rel="noopener noreferrer">
        insightifyhq@gmail.com
      </a>
      </p>

    </div>
  )
}