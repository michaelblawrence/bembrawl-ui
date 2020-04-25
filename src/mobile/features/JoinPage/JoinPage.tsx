import React from "react";
import { useState } from "react";
import "../../App.css";
import "./JoinPage.css";
import { Button, Input } from "@material-ui/core";
import { WaitingMessage } from "../../../core-common/WaitingMessage";
import { Branding } from "../../../core-common/Branding";
import { generateMappedInputSetter } from "../../../core/utils/generateMappedInputSetter";
import { PageProps } from "../PageProps";

export function JoinPage(props: PageProps) {
  const [roomId, setRoomId] = useState<number | null>(null);
  const onRoomIdChange = generateMappedInputSetter<number | null>(
    setRoomId,
    (value: string) => parseInt(value.substring(0, 4), 10),
    null
  );
  const submit = () => {
    console.log(roomId);
    if (!roomId) {
      return;
    }
    props.setMessage.JoinRoom({
      payload: { roomId: `${roomId}` },
    });
  };
  const submitEnabled = !!(roomId && roomId > 999 && roomId < 10000);
  const onRoomIdKey = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (submitEnabled && ev.key === "Enter") {
      submit();
      ev.preventDefault();
    }
  };
  return (
    <div className="App">
      <Branding />
      <div className="JoinPage">
        <h1>Enter room ID:</h1>
        <Input
          placeholder="XXXX"
          onChange={onRoomIdChange}
          onKeyPress={onRoomIdKey}
          inputProps={{ inputMode: "numeric", style: { textAlign: "center" } }}
          style={{ color: "white" }}
          value={roomId || ""}
        />
        <Button disabled={!submitEnabled} onClick={submit}>
          Enter
        </Button>
      </div>
      <header className="App-header">
        <h1>Lets get going</h1>
        <WaitingMessage />
      </header>
    </div>
  );
}
