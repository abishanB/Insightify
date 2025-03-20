import React from "react";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PrivacyPolicy(){
  const location = useLocation();

  useEffect(() => {//scroll to top of page on load
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
        We gather your information directly through the Spotify Web API. To provide our service, we access your top tracks, top artists, your user profile, your saved tracks and your saved playlists. 
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
        We may temporarily store your user ID and playlist data to ensure efficient processing and reduce load times.
        <br></br><br></br>
        This data is stored in a database accessible only to Insightify and is automatically deleted after 7 days.
      </p>

      <h6>Data Sharing</h6>
      <p>
      We do not share, sell, or rent your personal data to any third parties.
      <br></br><br></br>
      We do not share your data for any marketing purposes or with any external organizations.
      </p>

      <h6>Cloudflare</h6>
      <p>
      We use Cloudflare, a content delivery network and internet security service, to manage the DNS and route traffic to our website.
      <br></br><br></br>
      As part of providing these services, Cloudflare may collect information about your device and web traffic, such as IP addresses, for security and performance optimization purposes.
      <br></br><br></br>
      For more details, please refer to Cloudflare's Privacy Policy here,&nbsp;
      <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
        https://www.cloudflare.com/privacypolicy/
      </a>
      </p>

      <h6>Contact</h6>
      <p>
      If you have any questions about this Privacy Policy you can contact us at&nbsp;
      <a href="mailto:contact@insightifyapp.com" target="_blank" rel="noopener noreferrer">
        contact@insightifyapp.com
      </a>
      </p>

    </div>
  )
}