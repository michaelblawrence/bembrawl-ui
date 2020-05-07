import { PageState } from "../enums/PageState";
import {
  PlayerState,
  LastJoinedPlayerNotification,
} from "../features/PageProps";
import { GameType } from "../../core/enums/GameType";
import {
  ClientMessage,
  JoinedPlayerMessage,
  EmojiNewPromptMessage,
  EmojiAllResponsesMessage,
  EmojiGameStartedMessage,
  RoomReadyMessage,
} from "../../core/server/server.types";
import { CoreMessageProps } from "../../core/model/types";

export class PlayersClientConstants {
  public static readonly TIMEOUT_ALERT_JOINED_PLAYER_MS = 8000;
}

export interface MessageUpdate {
  state?: PlayerState;
  page?: PageState;
}

export interface MessageEffects {}

export type MessageProps<T extends ClientMessage> = CoreMessageProps<
  PlayerState,
  MessageEffects,
  T
>;

export class ClientMessageHandler {
  public ROOM_READY({ state }: MessageProps<RoomReadyMessage>): MessageUpdate {
    state.RoomInfo.isJoining = false;
    return { state, page: PageState.WaitingRoom };
  }

  public JOINED_PLAYER({
    state,
    msg,
  }: MessageProps<JoinedPlayerMessage>): MessageUpdate {
    state.RoomInfo.playerCount = msg.payload.playerCount;
    if (
      msg.payload.playerJoinOrder === null &&
      msg.payload.playerJoinName === null
    ) {
      return { state };
    }
    const playerIndex =
      msg.payload.playerJoinOrder === null
        ? -1
        : msg.payload.playerJoinOrder + 1;
    const playerName = msg.payload.playerJoinName || `Player ${playerIndex}`;
    const displayTimeout =
      PlayersClientConstants.TIMEOUT_ALERT_JOINED_PLAYER_MS;

    state.RoomInfo.lastJoined = {
      displayUntilMs: msg.payload.eventTime + displayTimeout,
      playerName: playerName,
      eventNotificationType: msg.payload.playerNameChanged
        ? LastJoinedPlayerNotification.NameChange
        : LastJoinedPlayerNotification.Joined,
    };
    return { state };
  }

  public EMOJI_GAME_STARTED({
    state,
    msg,
    connectionInfo,
  }: MessageProps<EmojiGameStartedMessage>): MessageUpdate {
    const isPromptPlayer =
      connectionInfo?.deviceGuid === msg.payload.initialPromptPlayer.playerId;
    state.EmojiGame.promptPlayerAnswersEmoji =
      msg.payload.promptPlayerAnswersEmoji;
    state.RoomInfo.gameType = GameType.Emoji;
    if (isPromptPlayer) {
      return { state, page: PageState.SetPrompt };
    } else {
      return { state, page: PageState.WaitingRoom };
    }
  }

  public EMOJI_NEW_PROMPT({
    state,
    msg,
    connectionInfo,
  }: MessageProps<EmojiNewPromptMessage>): MessageUpdate {
    const wasPromptPlayer =
      connectionInfo?.deviceGuid === msg.payload.promptFromPlayerId;
    state.EmojiGame.Question.Subject = msg.payload.promptSubject;
    state.EmojiGame.Question.Prompt = msg.payload.promptText;

    if (wasPromptPlayer && !state.EmojiGame.promptPlayerAnswersEmoji) {
      return { state, page: PageState.WaitingRoom };
    } else {
      return { state, page: PageState.PlayersAnswer };
    }
  }

  public EMOJI_ALL_RESPONSES({
    state,
    msg,
  }: MessageProps<EmojiAllResponsesMessage>): MessageUpdate {
    state.EmojiGame.AnswerEmoji = msg.payload.emojiResponses;
    return { state, page: PageState.PlayersAnswerReview };
  }
}
