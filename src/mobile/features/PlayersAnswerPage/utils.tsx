import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export function mapDimensionsToEmojiSizes(height: number, width: number) {
  if (width < 340) {
    return {
      perLine: 8,
      emojiSize: 24,
    };
  }
  if (width < 400) {
    return {
      perLine: 9,
      emojiSize: 24,
    };
  }
  if (width < 600) {
    return {
      perLine: 11,
      emojiSize: 24,
    };
  }
  if (width > 1000) {
    return {
      perLine: 16,
      emojiSize: 48,
    };
  }
  if (width > 700) {
    return {
      perLine: 12,
      emojiSize: 48,
    };
  }
  return {
    perLine: 9,
    emojiSize: 24,
  };
}
