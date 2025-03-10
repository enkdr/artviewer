import React from 'react'
import { iconPaths } from '../types'


interface IconProps {
    icon: keyof typeof iconPaths;
    onClick?: (e: any) => void;
    size?: number;
    className?: string;
}


export const Icon: React.FC<IconProps> = ({ icon, onClick, size = 24, className }) => {

    const paths = iconPaths[icon];

    if (!paths) {
        console.warn(`No icon found for ${icon}`);
        return null;
    }

    return (
        <svg
            className={className}
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            width={size}
            height={size}
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
            stroke="currentColor"
        >
            {paths.map((path, i) => (
                <path key={i} d={path}></path>
            ))}
        </svg>
    );
}


export const defaultProfileImage = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" strokeWidth="0.75">
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
        <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
    </svg>
);

export const defaultArtworkImage = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" strokeWidth="0.75">
        <path d="M15 8h.01"></path>
        <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z"></path>
        <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"></path>
        <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"></path>
    </svg>
)