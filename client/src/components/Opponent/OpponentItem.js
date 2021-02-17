import React from 'react';
import classNames from "classnames";
import { SwordsIcon } from "../../components/SwordsIcon.component";
import "./opponentItem.css";

export const Opponent = ( { user: { nickname, status, id }, onClick, chosenId }) => {
    return (
        <div className={classNames(
                                "oppItem-container", 
                                status, 
                                {"focused": id === chosenId}
                                )}
             onClick={() => onClick(id, status)}
        >
        
            <div className="oppItem-content">   
                { nickname }
            </div>

            {
                status === "battle" ? <SwordsIcon /> : 
                <div className={classNames("oppItem-status", status)}>
                </div>
            }
        </div>
    )
}