import React from 'react';
import { getFormatedDate } from "../../formatDate";
import "./chatMessage.css";

export const ChatMessage = ( { message, fromId, fromName, time, currentId }) => {
    return (
        <div className={
                `message_container 
                ${ fromId === currentId ? 'right' : 'left'}`
            }>
            {
               fromId === currentId ? null : 
                    <div className="message_sender">
                        { fromName }
                    </div>
            }
            
            <div className="message_body">
                { message }
                
                <span className="message_time">
                    { getFormatedDate(time) }
                </span>
            </div>
            
        </div>
    )
}