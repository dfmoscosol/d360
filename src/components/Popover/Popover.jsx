import React, { useState, useRef } from "react";

const PopoverWrapper = ({ children }) => {
  return <div className="relative">{children}</div>;
};

const PopoverTrigger = ({ children, setShow }) => {
  return <button onClick={() => setShow((show) => !show)}>{children}</button>;
};

const PopoverContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute bg-white z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-lg outline-none ${className}`}
      {...props}
    />
  );
});

const Popover = () => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  return (
    <PopoverWrapper>
      <PopoverTrigger setShow={setShow}></PopoverTrigger>
      {show && (
        <PopoverContent
          ref={ref}
          className="additional-classnames"
        ></PopoverContent>
      )}
    </PopoverWrapper>
  );
};

export { Popover, PopoverTrigger, PopoverContent };
