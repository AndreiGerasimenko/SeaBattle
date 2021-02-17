import React, { useEffect } from 'react';
import { animateScroll } from "react-scroll";
import "./chat.component.css";
import { Typography, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useInput } from "../../hooks/controlledInput.hook";
import { ChatMessage } from "../ChatMessage/ChatMessage.component";
import { Link } from "react-router-dom";


export const ChatComponent = ({ chatLog }) => {
    const userId = useSelector(state => state.auth.userId);
    const { chatConnection, opponentNickname } = useSelector(state => state.opponent);
    const { resetInput, bind, value} = useInput();
    
    const sendMessage = () => {
        if(!value.trim()) {
            return;
        }
        const messageToSend = {
            message: value,
            time: Date.now()
        }

        chatConnection.send(JSON.stringify({
            type: "CHAT_MESSAGE",
            payload: messageToSend
        }));

        resetInput();
    }

    useEffect(() => {
        animateScroll.scrollToBottom({
            containerId: "chat_messages_container",
            smooth: false,
            duration: 1
        });
    });

    return (
        <div className="chat_container">
            <div className="chat">
                <Typography.Title level={3} className="chat_title">
                   {`${opponentNickname} chat`}
                </Typography.Title>
                <div 
                    className="chat_messages_container"
                    id="chat_messages_container"
                >
                    {
                        chatLog ? 
                            chatLog.map(message => {
                                return <ChatMessage
                                            message={message.message}
                                            fromId={message.sender}
                                            fromName={opponentNickname}
                                            time={message.time}
                                            currentId={userId}
                                            key={message._id}
                                        />
                            }) : null
                    }
                </div>
                <div className="chat_input">
                    <Input 
                        {...bind} 
                        placeholder="Message" 
                        onPressEnter={sendMessage}
                        suffix={
                            value.trim() ? 
                                <SendOutlined onClick={sendMessage} /> 
                                : <span />
                        }
                    />
                </div>
            </div>  
            <Link to="/game">
                Go to Game
            </Link>
        </div>
    );
}