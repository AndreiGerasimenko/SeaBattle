import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from "react-responsive";
import { setChatConnection, setOpponentID, setOpponentNickname } from "../../redux/actions";
import { WechatOutlined } from '@ant-design/icons';
import { Drawer, Badge } from "antd";
import { ChatComponent } from "../../components/chatComponent/Chat.component";
import { useBreakPoint } from "../../hooks/breakpoint.hook";
import { useWebsocket } from "../../hooks/websocket.hook";
import { showNotification } from "../../functions/showNotification";
import { discardFieldChanges } from "../../functions/discardFieldchanges";

import "./chatWrapper.css";

export const ChatWrapper = () => {
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

    const isWidthLess400 = useMediaQuery(
        { maxWidth: 400 }
    );

    const onIconClickHandler = useCallback(() => {
        openChat();
        setHiddenMessages(0);
    }, [openChat]);
    
    const { wsConnection } = useWebsocket({ 
        url: 'ws://localhost:5000/api/chat', 
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


    return (
        <>
            {
                isSmScreenSize ? (
                    <div className="chat-icon-container">
                        <Badge count={hiddenMessages} size="small" offset={[-8, 5]}>
                            <WechatOutlined 
                            className="chat-icon"
                            onClick={onIconClickHandler}
                            />
                        </Badge>
                    </div> 
                ) : (
                    <ChatComponent chatLog={chatLog}/>
                )
            }

            <Drawer
                placement="right"
                closable={false}
                onClose={onCloseDrawer}
                visible={chatShown}
                width={isWidthLess400 ? 300 : 400}
            >
                <ChatComponent chatLog={chatLog} 
                               closeChat={onCloseDrawer}
                               showCloseButton
                               />
            </Drawer>
        </>
    )
}