import React from "react";

import styles from "./NotLoggedIn.module.css";

const NotLoggedIn = () => {
  return (
    <div className={styles.container}>
      <div>You need to log in to Blizzard Services.</div>
      <a className={styles.link} href="/auth/bnet">
        Click here to log in using Blizzard API
      </a>
    </div>
  );
};

export default NotLoggedIn;
