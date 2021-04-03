import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setOpponentID, setOpponentNickname, setChatConnection, setCellSize } from "../../redux/actions";
import { ChatWrapper } from "../../components/chatWrapper/chatWrapper.component";
import { ModalComponent } from "../../components/Modal/Modal.component";
import { MainFieldSetup } from "../../components/MainFieldSetup/MainFieldSetup.component";
import { BattleFieldsContainer } from '../../components/BattleFieldsContainer/BattleFieldsContainer'
import { StatusTimerBox } from '../../components/StatusTimerBox/StatusTimerBox'
import { useBreakPoint } from "../../hooks/breakpoint.hook";
import { useWebsocket } from "../../hooks/websocket.hook";
import { showNotification } from "../../functions/showNotification";
import { discardFieldChanges } from "../../functions/discardFieldchanges";
import { useMediaQuery } from 'react-responsive';
import { useFieldState } from '../../hooks/fieldState.hook'
import "./gameField.css";

const HOST = window.location.origin.replace(/^http/, 'ws') + '/api/game';

export const GameFieldPage = () => {
  const dispatch = useDispatch();
  const opponentID = useSelector(state => state.opponent.opponentId);
  const [chatLog, setChatLog] = useState(null);
  const [hiddenMessages, setHiddenMessages] = useState(0);
  const [isWaitingOpponent, setWaitingOpponent] = useState(false);
  const [isYourTurn, setIsYourTurn] = useState(null);
  const [gameResult, setGameResult] = useState(null);

  const { 
    fieldState: fieldSetup,
    changeState: changeFieldState,
    setFieldState: setFieldSetup
  } = useFieldState();

  const { 
    fieldState: enemyFieldState,
    changeState: changeEnemyFieldState,
    setFieldState: setEnemyFieldState
  } = useFieldState(); 

  const { chatShown,
    isSmScreenSize,
    onCloseDrawer,
    openChat
  } = useBreakPoint(1200);

  const onMessageCallback = useCallback((msg) => {
    const message = JSON.parse(msg.data);

    switch(message.type) {
        case "CHAT_HISTORY": 
            setChatLog(message.payload);
            break;
        case "CHAT_MESSAGE":
            setChatLog(prevState => {
                const newState = [...prevState];
                newState.push(message.payload);
                return newState;
            });
            
            if(isSmScreenSize && !chatShown) setHiddenMessages(prev => prev + 1);
            break;
        case "WAITING_FOR_OPPONENT": 
            console.log("Waiting for the opponent");
            setWaitingOpponent(true);
            break;
        case "GAME_START": 
            setFieldSetup(message.payload.field);
            setEnemyFieldState(Array(10).fill(null).map(_ => Array(10).fill(1)));
            setIsYourTurn({ turn: message.payload.turn });
            setWaitingOpponent(false);
            break;
        case "CHANGE_OPPONENTS_FIELD":
            changeEnemyFieldState(message.payload.changes);
            setIsYourTurn({ turn: message.payload.turn });
            break;
        case "CHANGE_YOUR_FIELD":
            changeFieldState(message.payload.changes);
            setIsYourTurn({ turn: message.payload.turn });
            break;
        case "GAME_RESULT":
            setGameResult(message.payload.status);
            break;
        default: 
            console.log("Unknown message type!"); 
    }
  }, [
    isSmScreenSize, 
    chatShown, 
    setFieldSetup, 
    changeFieldState, 
    changeEnemyFieldState, 
    setEnemyFieldState,
    setGameResult
  ]);

  const onWSClose = (event) => {

    showNotification({
      message: "WS closed",
      description: `${event.code}, ${event.reason}, ${event.wasClean}`,
      type: 'error'
    })

    if(event.code === 4000) {
        showNotification({
            message: "You won",
            description: "Your opponent has abandoned the game",
            type: "success"
        })
    } else if(event.code === 4001) {
        showNotification({
            message: "Back to menu",
            description: "The opponent left before the start of the game."
        })
    }

    dispatch(setOpponentID(null));
    dispatch(setOpponentNickname(null));
    discardFieldChanges().map(item => dispatch(item));
  }

  const onOKModalHandler = useCallback(() => {
    dispatch(setOpponentID(null));
    dispatch(setOpponentNickname(null));
    discardFieldChanges().map(item => dispatch(item));
  }, [dispatch])

  const onIconClickHandler = useCallback(() => {
    openChat();
    setHiddenMessages(0);
  }, [openChat]);

  const { wsConnection } = useWebsocket({ 
    // url: 'ws://localhost:5000/api/game', 
    url: HOST,
    name: "gameSocket",
    onMessageCallback,
    onWSClose,
    opponentId: opponentID
  });

  const onCellClick = useCallback((x, y) => {
    if(!isYourTurn) return;
    if(enemyFieldState[x][y] > 1) return;
    wsConnection.send(
      JSON.stringify({
        type: "SHOT",
        payload: { x, y }
      })
    )
  }, [enemyFieldState, wsConnection, isYourTurn])

  useEffect(() => {
    setHiddenMessages(0);
  }, [isSmScreenSize]);

  useEffect(() => {
    if(wsConnection) dispatch(setChatConnection(wsConnection));
  }, [wsConnection, dispatch]);

  useEffect(() => {
    return () => {
        dispatch(setChatConnection(null));
    }
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch(setOpponentID(null));
      dispatch(setOpponentNickname(null));
    }
  },[dispatch]);

  const isSmallScreenSize = useMediaQuery(
    { maxWidth: 570 }
);

  useEffect(() => {
      const size = isSmallScreenSize ? 30 : 48;
      dispatch(setCellSize(size));
  }, [dispatch, isSmallScreenSize ]);

  const modalType = isWaitingOpponent ? "Waiting..." : gameResult
  const modalText = isWaitingOpponent ? 
    "Waiting for opponent`s field setup" :
    gameResult === 'Victory!' ? 
    'Congratulations. You defeated your opponent!' :
    'The next time you will be more lucky!'


  return (
            <div className="game-container">
              <div className="game">
                {
                  fieldSetup ? 
                    <>
                      <StatusTimerBox isYourTurn={isYourTurn} />
                      <BattleFieldsContainer 
                        fieldSetup={fieldSetup}
                        enemyFieldState={enemyFieldState}
                        onCellClick={onCellClick}
                      />
                    </> : <MainFieldSetup />
                }
              </div>

              <ChatWrapper
                isSmScreenSize={isSmScreenSize}
                hiddenMessages={hiddenMessages}
                onIconClickHandler={onIconClickHandler}
                chatLog={chatLog}
                onCloseDrawer={onCloseDrawer}
                chatShown={chatShown}
              />

              <ModalComponent 
                type={ modalType }
                modalText={modalText}
                confirmNotification={!!gameResult}
                onOk={onOKModalHandler}
              /> 
              
            </div>  
      );
};
