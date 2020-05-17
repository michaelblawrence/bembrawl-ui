import React from "react";
import "./QuestionSection.scss";
import { Emoji } from "emoji-mart";
import useWindowDimensions, { mapDimensionsToEmojiSizes } from "core/effects/useWindowDimensions";
import { EmojiOrText } from "core/model/types";
import { MultiLabel } from "../../../../core-common/MultiLabel";

export function QuestionSection(props: {
  emojiCount: number;
  playerPrompt: EmojiOrText;
  subject: EmojiOrText;
}) {
  const { emojiCount: rawEmojiCount, playerPrompt, subject } = props;
  const emojiCount = Math.max(0, Math.min(6, rawEmojiCount));
  return (
    <div className="QuestionSection">
      <header className="QuestionSection-header">
        <h1 className="QuestionSection-question">
          "<MultiLabel text={subject}></MultiLabel>" in {emojiCount} emoji...
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
