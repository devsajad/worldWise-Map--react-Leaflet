import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavLinks.module.css";


function NavLinks() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="test">
          <NavLink to="/Pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/Product">Product</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavLinks;
