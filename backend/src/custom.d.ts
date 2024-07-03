declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        MONGO_DB_URL: string;
        JWT_SECRET: string;
        // Add other environment variables here as needed
    }
}