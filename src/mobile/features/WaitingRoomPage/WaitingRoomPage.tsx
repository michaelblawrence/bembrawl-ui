import React from 'react';
import "./WaitingRoomPage.css";
import { Branding } from "../../../core-common/Branding";
import { PageState } from '../../../core/enums/PageState';
import { Messages } from '../../../core/enums/PageState';

export function WaitingRoomPage(props: {
  setPage: (page: PageState) => void;
  setMessage: Messages;
}) {
  return (
    <div>
      <Branding />
      <div className="WaitingRoom">
        <header className="WaitingRoom-header">
          <h1>YOU IN THE WAITING ROOM</h1>
          <h2>Check out the big screen!</h2>
        </header>
      </div>
    </div>
  );
}
