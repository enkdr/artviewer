import React from 'react'
import { iconPaths } from '../types'


interface IconProps {
    icon: keyof typeof iconPaths;
}



export const Icon: React.FC<IconProps> = ({ icon }) => {

    const paths = iconPaths[icon];

    if (!paths) {
        console.warn(`No icon found for ${icon}`);
        return null;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="32" height="32" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor">
            {paths.map((path, i) => (
                <path key={i} d={path}></path>
            ))}
        </svg>
    )
}