// InputWithIcon.tsx - Updated with Tailwind
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
    <div className="flex items-center rounded-lg p-3 w-full  h-12 bg-transparent relative border border-gray-700">
      <span className="mr-2 mt-1 text-black border-r border-gray-300 pr-2">
        {icon}
      </span>
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border-none outline-none flex-1 bg-transparent text-black w-full placeholder:text-gray-500"
      />
      {type === "password" && (
        <button 
          onClick={togglePasswordVisibility} 
          className="bg-transparent border-none cursor-pointer text-white p-0 hover:opacity-70 transition-opacity"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
};

export default InputWithIcon;

