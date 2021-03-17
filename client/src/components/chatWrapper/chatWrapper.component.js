import React from "react";
import { useMediaQuery } from "react-responsive";
import { WechatOutlined } from '@ant-design/icons';
import { Drawer, Badge } from "antd";
import { ChatComponent } from "../../components/chatComponent/Chat.component";
import "./chatWrapper.css";

export const ChatWrapper = ({ 
    isSmScreenSize, 
    hiddenMessages, 
    onIconClickHandler,
    chatLog,
    onCloseDrawer,
    chatShown
}) => {

    const isWidthLess400 = useMediaQuery(
        { maxWidth: 400 }
    );
    
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