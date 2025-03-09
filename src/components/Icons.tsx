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


export const defaultProfileImage = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="48" height="48" stroke-width="0.75">
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
        <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
    </svg>
);