// src/server.ts
import { Server } from 'http';
import app from './app';
import config from './config';

async function main() {
    // Only start the server if not in Vercel environment
    if (process.env.NODE_ENV !== 'production') {
        const server: Server = app.listen(config.port, () => {
            console.log("Server is running on port ", config.port);
        });

        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.info("Server closed!");
                });
            }
            process.exit(1);
        };

        process.on('uncaughtException', (error) => {
            console.log(error);
            exitHandler();
        });

        process.on('unhandledRejection', (error) => {
            console.log(error);
            exitHandler();
        });
    } else {
        console.log("Running in production mode (Vercel)");
    }
}

main();