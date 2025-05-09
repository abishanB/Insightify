import React from "react";
import "./Footer.css";

export default function NavigationBar() {
  return (
    <footer>
      <div>
        <p>© 2025 Insightify</p>
        <p>All images are copyrighted by their respective copyright owners.</p>
        <p>
          We are not related to Spotify AB or any of it's partners in any way.
        </p>
      </div>

      <div className="footer-right">
        <a href="/privacy">
          <p>Privacy Policy</p>
        </a>
        <a href="/end-user-agreement">
          <p>End User Agreement</p>
        </a>
      </div>
    </footer>
  );
}
