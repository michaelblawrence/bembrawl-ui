import React from "react";

import "./EmojiAnswers.scss";
import { Emoji } from "emoji-mart";
import { Grid } from "@material-ui/core";

export function EmojiRow(props: { emojiList: string[] }) {
  let { emojiList } = props;
  return (
    <Grid container direction="row" alignContent="center" className="EmojiRow">
      {emojiList.map((emoji) => (
        <Emoji size={32} emoji={emoji} set={"apple"} />
      ))}
    </Grid>
  );
}
