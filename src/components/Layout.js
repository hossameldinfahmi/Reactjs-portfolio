import React from "react";

const Layout = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full h-full inline-block z-0 bg-light p-32 dark:bg-dark xl:p-24 lg:16 md:p-12 sm:p-2 ${className}`}
    >
      {children}
    </div>
  );
};

export default Layout;
