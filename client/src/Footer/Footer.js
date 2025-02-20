import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function NavigationBar() {
  return (
    <footer>
      <div>
        <p>© 2025 - Insightify</p>
        <p>All images are copyrighted by their respective copyright owners.</p>
        <p>
          We are not related to Spotify AB or any of it's partners in any way.
        </p>
      </div>

      <div className="footer-right">
        <Link to="privacy">
          <p>Privacy Policy</p>
        </Link>

        <a href="https://github.com/abishanB/Insightify" target="_blank" rel="noopener noreferrer">
          <p>Github</p>
        </a>
      </div>
    </footer>
  );
}
