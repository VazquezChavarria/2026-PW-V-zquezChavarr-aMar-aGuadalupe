const MINI_SERVIDOR_URL = 'http://localhost:4000';
// backend-memoria de la semana 9 escucha en el 3001 (el 3306 es el puerto de MySQL, no de un backend).
const BACKEND_URL = 'http://localhost:3001';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            { source: '/mini/:path*', destination: `${MINI_SERVIDOR_URL}/:path*` },
            { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` },
        ];
    },
};

export default nextConfig;
