import { useState } from 'react';
import { clearCache } from '../db';

export const Settings: React.FC = () => {
    const [done, setDone] = useState(false);

    const handleClearCache = async () => {
        await clearCache();
        setDone(true);
        setTimeout(() => window.location.reload(), 800);
    };

    return (
        <div style={{ padding: '2.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontWeight: 300, fontSize: '1.6rem' }}>Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button className="settings-action-btn" onClick={handleClearCache} disabled={done}>
                    {done ? 'Refreshing…' : 'Refresh Cache'}
                </button>
                <span style={{ fontSize: '0.75rem', color: 'rgba(3,18,60,0.4)' }}>
                    Forces a fresh data fetch from the server on next load.
                </span>
            </div>
        </div>
    );
};
