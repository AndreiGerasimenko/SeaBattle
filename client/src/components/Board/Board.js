import React from 'react';
import { useSelector } from 'react-redux';
import { Cell } from '../Cell/Cell';
import { Ship } from '../Ship/Ship';
import './board.css';

export const Board = () => {

    const field = useSelector(state => state.gameFieldSetup.tableState);
    const { visualState, cellSize } = useSelector(state => state.gameFieldSetup);
    // const visualState = useSelector(state => state.gameFieldSetup.visualState);
    // const cellSize = useSelector(state => state.gameFieldSetup.cellSize); 
    

    return (
        <div className="board-container" style={{ maxWidth: `${cellSize * 10}px`}}>
            {
                field.map((item, y) => {
                    return item.map((data, x) => {
                        const foundShip = visualState.find(item => {
                            return item.x === x && item.y === y
                        });

                        const renderContent = foundShip ? 
                            <Ship 
                                  { ...foundShip}
                                  onField={true}
                            /> : null;

                        return (
                            <div key={`${x}${y}`} className="board-cell">
                                {
                                    <Cell status={data} x={x} y={y}>
                                        { renderContent }
                                    </Cell>
                                }
                            </div>
                        )
                    }) 
                })
            }
        </div>
    )
}