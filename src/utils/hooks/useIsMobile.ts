import { useState, useEffect } from "react";

const useIsMobile = (breakpoint: number = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check initially
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
