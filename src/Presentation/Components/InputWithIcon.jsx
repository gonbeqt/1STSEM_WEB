import React from "react";

const InputWithIcon = ({
  icon,
  placeholder = "Enter text...",
  value,
  onChange,
  type = "text", 
}) => {
  return (
    <div style={styles.container}>
      <span style={styles.icon}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={styles.input}
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    border: "1px solid white",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    width: "100%",
    backgroundColor: "transparent",
  },
  icon: {
    marginRight: "0.5rem",
    color: "white",
    borderRight: "1px solid #d1d5db",
    paddingRight: "0.5rem",
  },
  input: {
    border: "none",
    outline: "none",
    flex: 1,
    backgroundColor: "transparent",
    color: "white",
  },
};

export default InputWithIcon;
