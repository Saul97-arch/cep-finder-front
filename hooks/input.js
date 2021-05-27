import { useState } from "react";
import styles from "../styles/Form.module.css";

export const useInput = ({ type }) => {
  // add mascara pra cep
  const [value, setValue] = useState("");
  const input = (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
      className="rounded-md p-1"
      className={styles.input}
    />
  );
  return [value, input];
};
