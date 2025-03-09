import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to={"/"}>
      <img alt="WorldWise logo" className={styles.logo} src="/logo.png" />
    </Link>
  );
}

export default Logo;
