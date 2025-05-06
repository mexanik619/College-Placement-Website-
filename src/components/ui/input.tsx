// import React from "react";

// export function Input({
//   placeholder,
//   value,
//   onChange,
//   className = "",
// }: {
//   placeholder?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   className?: string;
// }) {
//   return (
//     <input
//       type="text"
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       className={`border rounded px-3 py-2 w-full ${className}`}
//     />
//   );
// }

import React from "react";

export function Input({
  placeholder,
  value,
  onChange,
  className = "",
  style = {},
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded px-3 py-2 w-full text-black ${className}`}
      style={{ color: "#000000", ...style }}
    />
  );
}

