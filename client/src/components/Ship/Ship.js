import React, { useRef } from 'react';
import classNames  from 'classnames'; 
import { useDispatch, useSelector } from 'react-redux';
import { setHoverState, setTableState, setVisualState } from "../../redux/actions";
import { useDrag } from 'react-dnd';
import { getRotateDirection,
         clearTableState, 
         renderTableState, 
         calculateNewShiphead } from '../../functions/renderFieldFunctions';
import "./ship.css";

export const Ship = ({size, orientation, id, onField, x, y}) => {
    const dispatch = useDispatch();
    const tableCopy = useRef(null);
    const tableState = useSelector(state => state.gameFieldSetup.tableState);
    const cellSize = useSelector(state => state.gameFieldSetup.cellSize);

    const [{isDragging}, drag] = useDrag({
        item: { type: "ship" },
        begin: monitor => {

            //Selected block calculation

            let selectedBlock = 0;

            if(orientation === "vertical") {
                const verticalOffset = 
                    monitor.getInitialClientOffset().y -
                    monitor.getInitialSourceClientOffset().y;
                selectedBlock = Math.floor(verticalOffset / 50) + 1;
            } else {
                const horizontalOffset = 
                    monitor.getInitialClientOffset().x -
                    monitor.getInitialSourceClientOffset().x;
                selectedBlock = Math.floor(horizontalOffset / 50) + 1;
            }

            //----------------------------------------------

            if(onField) {
                //clear table state after picking

                tableCopy.current = JSON.parse(JSON.stringify(tableState));
                clearTableState({x, y, tableState, orientation, size});
                dispatch(setTableState(tableState));

                //------------------------------------------------------
            }

            return { type: "ship", size, selectedBlock, id, onField, orientation };
        },
        end: (item, monitor) => {  
                const newArray = Array(10).fill(null).map(() => Array(10).fill(0));
                dispatch(setHoverState(newArray));

                if(!monitor.didDrop() && item.onField) {
                    dispatch(setTableState(tableCopy.current));
                } else {
                    tableCopy.current = null;
                }
        },
        collect: monitor => {
            return ({
                    isDragging: !!monitor.isDragging(),
            })
        },
    })

    const rotateShip = () => {
        if(!onField) return;

        const rotationDirection = getRotateDirection({x, y, size, orientation, tableState});
        const { newX, newY } = calculateNewShiphead({x, y, size, rotationDirection});

        if(newX === undefined) return;
        
        clearTableState({x, y, tableState, orientation, size});
        const newOrientation = orientation === 'vertical' ? 'horizontal' : 'vertical';
        renderTableState({x: newX, y: newY, tableState, orientation: newOrientation, size});
        dispatch(setTableState(tableState));
        dispatch(setVisualState({
            x: newX,
            y: newY,
            id,
            size,
            orientation: newOrientation
        }));
    }

    const className = classNames('ship', { 'onfield': onField });

    return (
        <div className={className}
             onClick={rotateShip}
             ref={drag}
             style={{ width: (orientation === 'vertical') ?
                        `${cellSize}px` : `${cellSize * size}px`,
                      height: (orientation === 'vertical') ?
                        `${cellSize * size}px` : `${cellSize}px`,
                      opacity: isDragging ? 0.5 : 1,
                      zIndex: isDragging ? -1 : 1
                    }}>
        </div>
    );
}