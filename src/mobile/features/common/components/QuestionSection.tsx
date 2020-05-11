import React, { useState, useEffect } from "react";
import "./QuestionSection.scss";
import { Emoji } from "emoji-mart";
import { mapDimensionsToEmojiSizes } from "../../PlayersAnswerPage/utils";

type EmojiOrText = string | { type: "emoji"; emoji: string[] };

// dup
export default function useWindowDimensions() {
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

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

export function QuestionSection(props: {
  emojiCount: number;
  playerPrompt: EmojiOrText;
  subject: string;
}) {
  const { emojiCount: rawEmojiCount, playerPrompt, subject } = props;
  const emojiCount = Math.max(0, Math.min(6, rawEmojiCount));
  return (
    <div className="QuestionSection">
      <header className="QuestionSection-header">
        <h1 className="QuestionSection-question">
          "{subject}" in {emojiCount} emoji...
        </h1>
        <QuestionPrompt playerPrompt={playerPrompt} />
      </header>
    </div>
  );
}
function QuestionPrompt(props: { playerPrompt: EmojiOrText }) {
  const { playerPrompt } = props;
  const { height, width } = useWindowDimensions();
  const { emojiSize } = mapDimensionsToEmojiSizes(height, width);
  if (typeof playerPrompt === "string") return <h2>{playerPrompt}</h2>;
  switch (playerPrompt.type) {
    case "emoji":
      return (
        <h2>
          {playerPrompt.emoji.map((emoji, idx) => (
            <Emoji
              set={"apple"}
              emoji={emoji}
              size={emojiSize}
              key={emoji + idx}
            />
          ))}
        </h2>
      );
    default:
      return null;
  }
}
