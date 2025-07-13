import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <img src="/logo-green.png" alt="Natour Logo" />
      </div>

      <ul className="footer__nav">
        <li>
          <a href="#">About us</a>
        </li>
        <li>
          <a href="#">Download apps</a>
        </li>
        <li>
          <a href="#">Become a guide</a>
        </li>
        <li>
          <a href="#">Careers</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul>

      <p className="footer__copyright">
        &copy; {new Date().getFullYear()} by Elias R.
      </p>
    </footer>
  );
};

export default Footer;
