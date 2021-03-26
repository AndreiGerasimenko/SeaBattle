import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerList, 
         setGlobalWsConnection, 
         setOpponentID,
         setOpponentNickname } from "../../redux/actions";
import { Switch, Route, Redirect } from "react-router-dom";
import { MainMenuPage } from "../../pages/MainMenuPage/MainMenuPage";
import { StatisticPage } from "../../pages/StatisticPage/StatisticPage";
import { GameFieldPage } from "../../pages/GameFieldPage/GameFieldPage";
import { useWebsocket } from "../../hooks/websocket.hook";
import { ModalComponent } from "../Modal/Modal.component";
import { OpponentsList } from "../OpponentsList/OpponentList";
import { showNotification } from '../../functions/showNotification';

export const AuthWrapper = () => {
    const dispatch = useDispatch();
    const [modalType, setModalType] = useState(null);
    const [modalText, setModalText] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [opponentId, setOpponentId] = useState(null);
    const opponentID = useSelector(state => state.opponent.opponentId);

    const onMessageCallback = useCallback((msg) => {
        const message = JSON.parse(msg.data);

        switch(message?.type) {
            case "PLAYERS_ARRAY": 
                dispatch(setPlayerList(message.payload));
                break;
            case "CHALLANGE_IS_SENT":
                setModalType("Waiting...");
                break;
            case "CHALLANGE_NOTIFICATION": 
                setModalType("Challange");
                setModalText(message.payload.text);
                setOpponentId(message.payload.id);
                break;
            
            case "CHALLANGE_REJECTION":
                setConfirmLoading(false);
                setModalType(null);
                setOpponentId(null);
                setModalType(null);
                
                showNotification({
                    type: "error",
                    message: "Challenge rejection",
                    description: message?.payload
                });
                
                break;
            case "CHALLANGE_CONFIRMATION":
                setConfirmLoading(false);
                setModalType(null);
                setOpponentId(null);
                setModalType(null);
                dispatch(setOpponentID(message.payload.opponentId));
                dispatch(setOpponentNickname(message.payload.opponentNickname));
                break;
            default: console.log("Unknown message type");
        }

        console.log(message.payload, "Message");

    }, [dispatch, setModalType, setModalText, setOpponentId, setConfirmLoading]);

    const { wsConnection } = useWebsocket({ 
            url: 'ws://localhost:5000/api/globalWs', 
            name: "globalSocketConnection",
            onMessageCallback
    });
    
    const onOkModalClick = useCallback(() => {
        wsConnection.send(JSON.stringify({
            type: "CHALLANGE_ACCEPTANCE",
            payload: opponentId
        }));
        setConfirmLoading(true);
    },[wsConnection, opponentId, setConfirmLoading]);
    
    const onCancelModalClick = useCallback(() => {
        wsConnection.send(JSON.stringify({
            type: "CHALLANGE_REJECTION",
            payload: opponentId
        }));
        setModalType(null);
        setModalText(null);
        setOpponentId(null);
        setConfirmLoading(false);
    },[wsConnection, setModalType, setModalText, setOpponentId, opponentId]);

    useEffect(() => {
        if(wsConnection) dispatch(setGlobalWsConnection(wsConnection));
    }, [wsConnection, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(setGlobalWsConnection(null));
        }
    }, [dispatch])


    return (
        <>
        {
            opponentID ? 
                <Switch>
                    <Route path="/match" exact>
                        <GameFieldPage />
                    </Route>
                    <Redirect to="/match" />
                </Switch> :
                <Switch>
                    <Route path="/main_menu" exact>
                        <MainMenuPage />
                    </Route>
                    <Route path="/statistics" exact>
                        <StatisticPage />
                    </Route>
                    <Route path="/opponents" exact>
                        <OpponentsList />
                    </Route>
                    <Redirect to="/main_menu" />
                </Switch>
        }
        <ModalComponent 
            type={modalType}
            modalText={modalText}
            onOk={onOkModalClick}
            onCancel={onCancelModalClick}
            confirmLoading={confirmLoading}
        /> 
        </>
    ) 
}