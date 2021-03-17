import React, { useRef } from 'react';
import { setHoverState, 
         setTableState, 
         nextSettingStage,
         setVisualState } from "../../redux/actions";
import { useSelector, useDispatch } from 'react-redux';
import { Overlay } from '../Overlay/Overlay';
import { useDrop } from 'react-dnd';
import { renderTableState } from '../../functions/renderFieldFunctions';
import './cell.css';

export const Cell = ({ x, y, status, children }) => {

    const hoveredState = useSelector(state => state.gameFieldSetup.hoverState);
    const tableState = useSelector(state => {
        return JSON.parse(JSON.stringify(state.gameFieldSetup.tableState));
    });
    const cellSize = useSelector(state => state.gameFieldSetup.cellSize);
    const dispatch = useDispatch();
    const isError = useRef(false);
    
    const [, drop] = useDrop({
        accept: 'ship',
        canDrop: (_, monitor) => {
            return !isError.current
        },
        drop: (item, monitor) => {
            let newX = x;
            let newY = y;

            if(item?.orientation === 'vertical') {
                newY = y - item?.selectedBlock + 1;
            } else {
                newX = x - item?.selectedBlock + 1;
            }

            renderTableState({ 
                x: newX,
                y: newY,
                size: item?.size,
                orientation: item?.orientation,
                tableState
            });

            dispatch(setTableState(tableState));
            dispatch(setVisualState({
                id: item?.id,
                x: newX,
                y: newY,
                size: item?.size,
                orientation: item?.orientation
            }));

            if(!item?.onField) {
                dispatch(nextSettingStage());
            }
        },
        collect: monitor => {
            const item = monitor.getItem();
            
            if(!!monitor.isOver()) {
                isError.current = false;
                const newArray = Array(10).fill(null).map(() => Array(10).fill(0));

                if(item?.orientation === "vertical") {
                    for(let i = y - item?.selectedBlock + 1; i <= y + item?.size - item?.selectedBlock; i++ ) {
                        if(i>=0 && i<=9) {
                            if(tableState[i][x] === 1) {
                                newArray[i][x] = 1;
                            } else {
                                newArray[i][x] = 2;
                                isError.current = true;
                            }
                        } else {
                            isError.current = true;
                        }
                    }
                } else {
                    for(let i = x - item?.selectedBlock + 1; i <= x + item?.size - item?.selectedBlock; i++ ) {
                        if(i>=0 && i<=9) {
                            if(tableState[y][i] === 1) {
                                newArray[y][i] = 1;
                            } else {
                                newArray[y][i] = 2;
                                isError.current = true;
                            }
                        } else {
                            isError.current = true;
                        }
                    }
                }

                dispatch(setHoverState(newArray));
            }
        }
    });

    const active = status === 0;
    const empty =  status >= 2;
    return (
        <div className="cell"
             ref={drop}
             style={{
                 backgroundColor: active ? 'grey' : 
                    (empty ? 'lightblue' : 'transparent'),
                    height: `${cellSize}px`
             }}
        >
            { children }
            { hoveredState[y][x] === 1 && <Overlay color="lightgreen" /> } 
            { hoveredState[y][x] === 2 && <Overlay color="rgb(236, 86, 86)" /> }         
        </div>
    )
}