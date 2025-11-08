import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "../utils/cn";
import LogoSpinner from "./LogoSpinner";

const MIN_DISPLAY_MS = 400;
const FADE_OUT_MS = 200;

const RouteLoadingOverlay = ({ isActive = false }) => {
  const location = useLocation();
  const isFirstRenderRef = useRef(true);
  const [active, setActive] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // When isActive prop toggles, control overlay accordingly
  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      setActive(true);
      return;
    }

    // if prop turned off, start fade-out
    if (!isActive && shouldRender) {
      setActive(false);
    }
  }, [isActive]);

  // Maintain existing behavior for route changes when prop isn't used
  useEffect(() => {
    if (isActive) return; // prop-driven takes precedence

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    setShouldRender(true);
    setActive(true);

    const hideTimer = setTimeout(() => {
      setActive(false);
    }, MIN_DISPLAY_MS);

    return () => {
      clearTimeout(hideTimer);
    };
  }, [location.key]);

  useEffect(() => {
    if (!shouldRender) {
      return undefined;
    }

    if (active) {
      return undefined;
    }

    const cleanupTimer = setTimeout(() => {
      setShouldRender(false);
    }, FADE_OUT_MS);

    return () => {
      clearTimeout(cleanupTimer);
    };
  }, [active, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity",
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      style={{ transitionDuration: `${FADE_OUT_MS}ms` }}
    >
      <LogoSpinner label="Loading..." />
    </div>
  );
};

export default RouteLoadingOverlay;
