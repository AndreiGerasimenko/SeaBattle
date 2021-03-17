import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setOpponentID, setOpponentNickname, setChatConnection } from "../../redux/actions";
import { ChatWrapper } from "../../components/chatWrapper/chatWrapper.component";
import { MainFieldSetup } from "../../components/MainFieldSetup/MainFieldSetup.component";
import { useBreakPoint } from "../../hooks/breakpoint.hook";
import { useWebsocket } from "../../hooks/websocket.hook";
import { showNotification } from "../../functions/showNotification";
import { discardFieldChanges } from "../../functions/discardFieldchanges";
import "./gameField.css";

export const GameFieldPage = () => {
  const dispatch = useDispatch();
  const opponentID = useSelector(state => state.opponent.opponentId);
  const [chatLog, setChatLog] = useState(null);
  const [hiddenMessages, setHiddenMessages] = useState(0);

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
        default: 
            console.log("Unknown message type!"); 
    }

  }, [isSmScreenSize, chatShown]);

  const onWSClose = (event) => {
    if(event.code === 4000) {
        showNotification({
            message: "You won",
            description: "Your opponent has abandoned the game",
            type: "success"
        })
    dispatch(setOpponentID(null));
    dispatch(setOpponentNickname(null));
    discardFieldChanges().map(item => dispatch(item));
    }
  }

  const onIconClickHandler = useCallback(() => {
    openChat();
    setHiddenMessages(0);
  }, [openChat]);

  const { wsConnection } = useWebsocket({ 
    url: 'ws://localhost:5000/api/game', 
    name: "chatSocket",
    onMessageCallback,
    onWSClose,
    opponentId: opponentID
  });

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

  return (
            <div className="game-container">
              <div className="game">
                <MainFieldSetup />
              </div>

              <ChatWrapper
                isSmScreenSize={isSmScreenSize}
                hiddenMessages={hiddenMessages}
                onIconClickHandler={onIconClickHandler}
                chatLog={chatLog}
                onCloseDrawer={onCloseDrawer}
                chatShown={chatShown}
              />
              
            </div>  
      );
};
