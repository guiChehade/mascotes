import React from "react";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/icons/home.png";
import styles from "../styles/HomeIcon.module.css";

const HomeIcon = () => {
    const navigate = useNavigate();
  
    return (
        <div
            onClick={() => navigate("/app")}
            className={styles.homeIconContainer}
        >
            <img
                src={homeIcon}
                alt="Home"
                className={styles.homeIconImg}
            />
      </div>
    );
  };

  export default HomeIcon;