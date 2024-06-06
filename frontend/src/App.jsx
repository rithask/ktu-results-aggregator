import React from "react";
import Form from "./components/Form";
import "./App.css";
import styles from "./assets/styles.module.css";

export const App = () => {
  return (
    <div className={styles.container}>
      <Form />
    </div>
  );
};

export default App;
