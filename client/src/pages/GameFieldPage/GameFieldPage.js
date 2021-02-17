import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { setOpponentID, setOpponentNickname } from "../../redux/actions";
import { ChatWrapper } from "../../components/chatWrapper/chatWrapper.component";
import "./gameField.css";

export const GameFieldPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setOpponentID(null));
      dispatch(setOpponentNickname(null));
    }
  },[dispatch]);

  return (
            <div className="game-container">
              <div className="game">
                Here will be the game fields
              </div>

              <ChatWrapper />
              
            </div>  
      );
};
