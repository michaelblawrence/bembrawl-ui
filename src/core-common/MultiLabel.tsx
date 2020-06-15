import React from "react";
import { Emoji } from "emoji-mart";

import { EmojiOrText } from "core/model/types";
import useWindowDimensions, {
  mapDimensionsToEmojiSizes,
} from "core/effects/useWindowDimensions";

export function MultiLabel(props: { text: EmojiOrText }) {
  const { text: input } = props;
  const { height, width } = useWindowDimensions();
  const { emojiSize } = mapDimensionsToEmojiSizes(height, width);
  const Inline = (props: { children: string | JSX.Element[] }) => (
    <span style={{ display: "contents" }}>{props.children}</span>
  );
  if (typeof input === "string") return <Inline>{input}</Inline>;
  switch (input.type) {
    case "emoji":
      return (
        <Inline>
          {input.emoji.map((emoji, idx) => (
            <Emoji
              set={"apple"}
              emoji={emoji}
              size={emojiSize}
              key={emoji + idx}
            />
          ))}
        </Inline>
      );
    default:
      return null;
  }
}
