import { useEffect, useState } from "react";

export function useIsDesktop(breakpoint = 768): boolean {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth >= breakpoint,
  );

  useEffect(() => {
    function onResize() {
      setIsDesktop(window.innerWidth >= breakpoint);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isDesktop;
}