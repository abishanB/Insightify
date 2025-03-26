import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PrivacyPolicy() {
  const location = useLocation();

  useEffect(() => {
    //scroll to top of page on load
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="policy-container">
      <h4>End User Agreement</h4>
      <p>
      By using our application, Insightify, you agree to comply with and be bound by the terms of this Agreement. If you do not agree to the terms of this Agreement, do not use the application.
      </p>

      <h6>Disclaimer of Warranties</h6>
      <p>
        We do not make any warranties or representations on behalf of Spotify. We expressly disclaim all implied warranties with respect to the Spotify Platform, Spotify Service, and Spotify Content, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h6>Prohibited Activities</h6>
      <p>
        You are prohibited from modifying, creating derivative works, or making any alterations based on the Spotify Platform, Spotify Service, or Spotify Content, in whole or in part, without the express written consent of Spotify.
        <br></br>
        <br></br>
        You may not decompile, reverse-engineer, disassemble, or reduce the Spotify Platform, Spotify Service, or Spotify Content to source code or any human-perceivable form, except to the extent allowed by applicable law.
      </p>
      
      <h6>Responsibility for Products</h6>
      <p>
        We are solely responsible for the products and services provided through Insightify.
        <br></br>
        <br></br>
        You agree that Spotify is not liable for any damages, losses, or claims that may arise from your use of Insightify or any third-party services or content incorporated into the app.
      </p>

      <h6>Third-Party Beneficiary</h6>
      <p>
      Spotify is a third-party beneficiary of this Agreement. This means that Spotify has the right to enforce the terms of this Agreement, and they can directly seek enforcement of the terms described here, as if they were a party to this Agreement.
      </p>
    </div>
  );
}
