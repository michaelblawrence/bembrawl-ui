import React from "react";
import "./QuestionSection.scss";

export function QuestionSection(props: {
  emojiCount: number;
  playerPrompt: string;
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
        <h2>{playerPrompt}</h2>
      </header>
    </div>
  );
}
