import { useEffect, useState } from "react";

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}
