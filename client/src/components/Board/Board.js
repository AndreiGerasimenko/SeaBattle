import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Cell } from '../Cell/Cell';
import { Ship } from '../Ship/Ship';
import { useMediaQuery } from 'react-responsive';
import { setCellSize } from '../../redux/actions';
import './board.css';

export const Board = () => {

    const field = useSelector(state => state.gameFieldSetup.tableState);
    const visualState = useSelector(state => state.gameFieldSetup.visualState);
    const cellSize = useSelector(state => state.gameFieldSetup.cellSize); 
    const dispatch = useDispatch();

    const isSmallScreenSize = useMediaQuery(
        { maxWidth: 535 }
    );

    useEffect(() => {
        const size = isSmallScreenSize ? 30 : 50;
        dispatch(setCellSize(size));
    }, [dispatch, isSmallScreenSize ]);

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