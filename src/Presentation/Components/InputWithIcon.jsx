import React, { useState } from "react";
import EyeIcon from "./icons/EyeIcon";
import EyeOffIcon from "./icons/EyeOffIcon";

const InputWithIcon = ({
  icon,
  placeholder = "Enter text...",
  value,
  onChange,
  type = "text", 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    console.log('Toggling password visibility');
    setShowPassword(!showPassword);
  };

  return (
    <div style={styles.container}>
      <span style={styles.icon}>{icon}</span>
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={styles.input}
      />
      {type === "password" && (
        <button onClick={togglePasswordVisibility} style={styles.eyeButton}>
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    width: "90%",
    height: "25px ",
    backgroundColor: "transparent",
    position: "relative",
    border: "1px solid  #333",

  },
  icon: {
    marginRight: "0.5rem",
    marginTop: "0.3rem",
    color: "black",
    borderRight: "1px solid #d1d5db",
    paddingRight: "0.5rem",
  },
  input: {
    border: "none",
    outline: "none",
    flex: 1,
    backgroundColor: "transparent",
    color: "black",
    width: "100%",
  },
  eyeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
    padding: "0",
  },
};

export default InputWithIcon;
