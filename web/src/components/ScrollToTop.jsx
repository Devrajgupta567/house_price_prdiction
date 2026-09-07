import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop ensures that navigating between pages always scrolls the window back to top (0,0).
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, search, hash]);

  return null;
}
