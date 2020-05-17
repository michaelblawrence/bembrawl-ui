import { PageState } from "../enums/PageState";
import { HostState } from "../features/PageProps";
import {
  ClientMessage,
  EmojiNewPromptMessage,
  EmojiAllResponsesMessage,
  EmojiGameStartedMessage,
  RoomReadyMessage,
  ConnectSuccessMessage,
  PlayerListMessage,
  EmojiVotingResultsMessage,
  GuessFirstGameStartedMessage,
  GuessFirstAllResponsesMessage,
  GuessFirstVotingResultsMessage,
  GuessFirstMatchPromptMessage,
  GuessFirstWrongAnswerMessage,
} from "../../core/server/server.types";
import { CoreMessageProps } from "../../core/model/types";
import { GameType } from "../../core/enums/GameType";

export class PlayersClientConstants {
  public static readonly TIMEOUT_ALERT_JOINED_PLAYER_MS = 8000;
}

export interface MessageUpdate {
  state?: HostState;
  page?: PageState;
}

export interface MessageEffects {
  register: (type: GameType, roomId: number) => Promise<void>;
}

export type MessageProps<TMsg extends ClientMessage> = CoreMessageProps<
  HostState,
  MessageEffects,
  TMsg
>;

export class HostMessageHandler {
  public CONNECT_SUCCESS({
    state,
    msg,
  }: MessageProps<ConnectSuccessMessage>): MessageUpdate {
    state.RoomInfo.roomId = msg.payload.joinId;
    return { state };
  }

  public ROOM_READY({
    state,
    connectionInfo,
    effects,
  }: MessageProps<RoomReadyMessage>): MessageUpdate {
    if (!connectionInfo) return {};
    const { RoomInfo } = state;
    if (!RoomInfo.roomId) {
      console.error("register game without room id");
      return { page: PageState.WaitingForUsers };
    }
    effects.register(GameType.GuessFirst, RoomInfo.roomId);
    return {};
  }

  public PLAYER_LIST({
    state,
    msg,
  }: MessageProps<PlayerListMessage>): MessageUpdate {
    state.RoomInfo.players = msg.payload.players.map((player) => {
      const playerIndex = player.playerId === null ? -1 : player.playerId + 1;
      return {
        playerIndex,
        playerName: player.playerName || `Player ${playerIndex}`,
      };
    });
    return { state };
  }

  public EMOJI_GAME_STARTED({
    state,
    msg,
  }: MessageProps<EmojiGameStartedMessage>): MessageUpdate {
    const { initialPromptPlayer } = msg.payload;
    state.EmojiGame.Question.PromptPlayerName = initialPromptPlayer.playerName;
    return { state, page: PageState.PlayersWaitingRoom };
  }

  public EMOJI_NEW_PROMPT({
    state,
    msg,
  }: MessageProps<EmojiNewPromptMessage>): MessageUpdate {
    state.EmojiGame.Question = {
      TimeoutMs: msg.payload.timeoutMs,
      Prompt: msg.payload.promptText,
      Subject: msg.payload.promptSubject,
    };
    return { state, page: PageState.Question };
  }

  public EMOJI_ALL_RESPONSES({
    state,
    msg,
  }: MessageProps<EmojiAllResponsesMessage>): MessageUpdate {
    state.EmojiGame.PlayerAnswers = msg.payload.emojiResponses.map(
      (emojiResponse) => ({
        answerList: emojiResponse.responseEmoji,
        Subject: msg.payload.promptSubject,
        playerIndex: emojiResponse.playerJoinId,
        playerId: emojiResponse.playerId,
        votes: undefined,
      })
    );
    return { state, page: PageState.Answers };
  }

  public EMOJI_VOTING_RESULTS({
    state,
    msg,
  }: MessageProps<EmojiVotingResultsMessage>): MessageUpdate {
    for (const playerAnswer of state.EmojiGame.PlayerAnswers || []) {
      const playerVotes = msg.payload.votes.find(
        (info) => info.playerId === playerAnswer.playerId
      );
      playerAnswer.votes = playerVotes?.voteCount;
    }
    return { state, page: PageState.Results };
  }

  public GUESS_FIRST_GAME_STARTED({
    state,
    msg,
  }: MessageProps<GuessFirstGameStartedMessage>): MessageUpdate {
    const { initialPromptPlayer } = msg.payload;
    state.EmojiGame.Question.PromptPlayerName = initialPromptPlayer.playerName;
    return { state, page: PageState.PlayersWaitingRoom };
  }

  public GUESS_FIRST_MATCH_PROMPT({
    state,
    msg,
  }: MessageProps<GuessFirstMatchPromptMessage>): MessageUpdate {
    state.EmojiGame.Question = {
      TimeoutMs: msg.payload.timeoutMs,
      Subject: msg.payload.promptSubject,
      Prompt: { type: "emoji", emoji: msg.payload.promptEmoji },
    };
    state.EmojiGame.GuessFirst.Question = {
      secret: msg.payload.promptText,
      promptEmoji: msg.payload.promptEmoji,
    };
    return { state, page: PageState.Question };
  }

  public GUESS_FIRST_ALL_RESPONSES({
    state,
    msg,
  }: MessageProps<GuessFirstAllResponsesMessage>): MessageUpdate {
    state.EmojiGame.PlayerAnswers = msg.payload.correctResponses.map(
      (correctResponse) => ({
        playerId: correctResponse.playerId,
        playerIndex: correctResponse.playerJoinId,
      })
    );
    state.EmojiGame.GuessFirst.PlayerAnswers = msg.payload.correctResponses.map(
      (correctResponse) => ({
        playerId: correctResponse.playerId,
        playerIndex: correctResponse.playerJoinId,
      })
    );
    return { state, page: PageState.Answers };
  }

  public GUESS_FIRST_WRONG_ANSWER({
    state,
    msg,
  }: MessageProps<GuessFirstWrongAnswerMessage>): MessageUpdate {
    state.EmojiGame.GuessFirst.PlayerGuesses = [
      { text: msg.payload.incorrectGuess },
    ];
    return { state };
  }

  public GUESS_FIRST_VOTING_RESULTS({
    state,
    msg,
  }: MessageProps<GuessFirstVotingResultsMessage>): MessageUpdate {
    for (const playerAnswer of state.EmojiGame.PlayerAnswers || []) {
      const playerVotes = msg.payload.votes.find(
        (info) => info.playerId === playerAnswer.playerId
      );
      playerAnswer.votes = playerVotes?.voteCount;
    }
    for (const playerAnswer of state.EmojiGame.GuessFirst.PlayerAnswers || []) {
      const playerVotes = msg.payload.votes.find(
        (info) => info.playerId === playerAnswer.playerId
      );
      playerAnswer.score = playerVotes?.voteCount;
    }
    return { state, page: PageState.Results };
  }
}
