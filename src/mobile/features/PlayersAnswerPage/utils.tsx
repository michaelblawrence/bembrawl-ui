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
    // TODO somehow set .emoji-mart-scroll { height: 180px }
    console.log(`smallest ${width}`)
    return {
      perLine: 8,
      emojiSize: 24,
    };
  }
  if (width < 400) {
    console.log(`smallest ${width}`)
    return {
      perLine: 9,
      emojiSize: 24,
    };
  }
  if (width > 400) {
    console.log(`medium ${width}`)
    return {
      perLine: 11,
      emojiSize: 24,
    };
  }
  console.log(`default ${width}`)
  return {
    perLine: 9,
    emojiSize: 24,
  };
}
