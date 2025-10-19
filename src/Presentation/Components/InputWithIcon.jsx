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
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center rounded-lg p-3 w-full h-12 bg-white relative border border-gray-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all duration-200 shadow-sm">
      <span className="mr-3 text-gray-400 flex-shrink-0">
        {icon}
      </span>
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border-none outline-none flex-1 bg-transparent text-gray-900 w-full placeholder:text-gray-500 text-sm"
      />
      {type === "password" && (
        <button 
          type="button"
          onClick={togglePasswordVisibility} 
          onMouseDown={(event) => event.preventDefault()}
          className="bg-transparent border-none cursor-pointer text-gray-400 p-0 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          {showPassword ? (
            <EyeOffIcon size={18} className="pointer-events-none" />
          ) : (
            <EyeIcon size={18} className="pointer-events-none" />
          )}
        </button>
      )}
    </div>
  );
};

export default InputWithIcon;

