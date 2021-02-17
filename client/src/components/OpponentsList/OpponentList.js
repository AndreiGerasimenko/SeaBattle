import React, { useState, useCallback } from 'react';
import { Typography, Button, Space } from 'antd';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Opponent } from "../Opponent/OpponentItem";
import "./opponentList.css";

export const OpponentsList = () => {
    const [chosenId, setChosenId] = useState(null);
    const playerList = 
        useSelector(state => state.players.playerList.map(item => {
                return {...item}
            })
        );
    const globalWsConnection = 
        useSelector(state => state.auth.globalWsConnection);
    const playerId = useSelector(state => state.auth.userId);
    
    const onClickHandle = useCallback((id, status) => {
        if(status === 'online') {
            setChosenId(prevId => {
                return prevId === id ? null : id
            });
        }
    }, []);

    const onFightHandle = () => {
        if(globalWsConnection) {
            const message = {
                type: "MAKE_CHALLANGE",
                payload: chosenId
            }
            globalWsConnection.send(JSON.stringify(message));
        }
    }

    return (
        <div className="opp-container">
            <Typography.Title level={3} className="opp-title">
                Choose the opponent
            </Typography.Title>
            <div className="opp-list-container">
            {
                playerList?
                    playerList.filter(item => item.id !== playerId)
                    .map(user => {
                        return (
                            <Opponent 
                                key={user.id}
                                user={user}
                                chosenId={chosenId}
                                onClick={onClickHandle}
                            />
                        )
                    }):
                "Empty List"
            }
            </div>
            <div className="opp-button-container">
                <Space>
                    <Button 
                        type="primary"
                        disabled={!chosenId}
                        onClick={onFightHandle}
                    >
                        Fight
                    </Button>
                    <Link to="/main_menu">
                        <Button>Back</Button>
                    </Link>
                </Space>
            </div>
        </div>
    )
}
