// sw.js
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

// Cache images with a Cache First strategy.
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            // Add plugins here (e.g., expiration)
        ],
    })
);
