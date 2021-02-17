import React from 'react';
import Icon from '@ant-design/icons';

const SwordsSVG = () => (
    <svg width="17px" height="17px" viewBox="0 0 20 20" version="1.1">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Dribbble-Light-Preview" transform="translate(-340.000000, -7759.000000)" fill="#000000">
            <g id="icons" transform="translate(56.000000, 160.000000)">
                <polygon id="swords-[#101]" points="301.174002 7614.75989 303.9996 7617.58563 302.586801 7618.9995 299.761203 7616.17276 298.348404 7617.58563 296.934605 7616.17276 298.348404 7614.75989 294.0001 7609.98371 289.651796 7614.75989 291.064595 7616.17276 289.651796 7617.58563 288.238997 7616.17276 285.413398 7618.9995 283.9996 7617.58563 286.826197 7614.75989 285.413398 7613.34702 286.826197 7611.93415 288.238997 7613.34702 293.063895 7608.95554 283.9996 7598.9995 294.0001 7608.10322 303.9996 7598.9995 294.936304 7608.95554 299.761203 7613.34702 301.174002 7611.93415 302.586801 7613.34702"/>
            </g>
        </g>
    </g>
</svg>
);

export const SwordsIcon = (props) => {
    return (
        <Icon component={SwordsSVG} {...props} />
    )
}