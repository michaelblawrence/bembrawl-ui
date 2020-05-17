import React from "react";
import { Emoji } from "emoji-mart";

import { EmojiOrText } from "core/model/types";
import useWindowDimensions, { mapDimensionsToEmojiSizes } from "core/effects/useWindowDimensions";

export function MultiLabel(props: { text: EmojiOrText }) {
  const { text: input } = props;
  const { height, width } = useWindowDimensions();
  const { emojiSize } = mapDimensionsToEmojiSizes(height, width);
  if (typeof input === "string") return <span>{input}</span>;
  switch (input.type) {
    case "emoji":
      return (
        <span>
          {input.emoji.map((emoji, idx) => (
            <Emoji
              set={"apple"}
              emoji={emoji}
              size={emojiSize}
              key={emoji + idx}
            />
          ))}
        </span>
      );
    default:
      return null;
  }
}
