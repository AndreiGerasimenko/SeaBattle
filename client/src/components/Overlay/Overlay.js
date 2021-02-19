import React from 'react';
import './overlay.css';

export const Overlay = ({ color }) => {
    return (
        <div className='overlay'
             style={{
                 backgroundColor: color
             }}>
        </div>
    );
}