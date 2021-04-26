import React from 'react'
import classNames from 'classnames'
import ship from '../../assets/ship.png'
import waves from '../../assets/waves.png'
import bang from '../../assets/bang.png'
import './battleFieldCell.css'

const cellBackgroundImages = [ship, null, bang, waves];

export const BattleFieldCell = ({ value, onClickHandler, cellSize, children, hoverable }) => {
    const className = classNames("cell", { 'hoverable': hoverable });
    const image = cellBackgroundImages[value];
    return (
        <div 
            className={className}
            onClick={onClickHandler}
            style={
                {
                    height: `${cellSize}px`,
                    width: `${cellSize}px`,
                    fontSize: `${cellSize / 2}px`,
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'contain'
                }
            }
        >
            { children }
        </div>
    )
}