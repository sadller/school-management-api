const config = require('./config/index.config.js');
const Cortex = require('ion-cortex');
const ManagersLoader = require('./loaders/ManagersLoader.js');
const Aeon = require('aeon-machine');

process.on('uncaughtException', err => {
    console.log(`Uncaught Exception:`);
    console.log(err, err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled rejection at ', promise, `reason:`, reason);
    process.exit(1);
});

// Function to initialize MongoDB connection
const initializeMongoDB = async () => {
    if (config.dotEnv.MONGO_URI) {
        try {
            console.log('Initializing MongoDB connection...'); // Debugging log
            await require('./connect/mongo')({ uri: config.dotEnv.MONGO_URI });
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1); // Exit the process if MongoDB connection fails
        }
    } else {
        console.log('MongoDB URI not provided, skipping MongoDB connection');
    }
};

// Main function to initialize the application
const startApp = async () => {
    console.log('Starting application initialization...'); // Debugging log

    // Initialize MongoDB connection
    await initializeMongoDB();

    // Initialize Redis cache
    console.log('Initializing Redis cache...'); // Debugging log
    const cache = require('./cache/cache.dbh')({
        prefix: config.dotEnv.CACHE_PREFIX,
        url: config.dotEnv.CACHE_REDIS,
    });

    // Initialize Oyster
    console.log('Initializing Oyster...'); // Debugging log
    const Oyster = require('oyster-db');
    const oyster = new Oyster({
        url: config.dotEnv.OYSTER_REDIS,
        prefix: config.dotEnv.OYSTER_PREFIX,
    });

    // Initialize Cortex
    console.log('Initializing Cortex...'); // Debugging log
    const cortex = new Cortex({
        prefix: config.dotEnv.CORTEX_PREFIX,
        url: config.dotEnv.CORTEX_REDIS,
        type: config.dotEnv.CORTEX_TYPE,
        state: () => ({}),
        activeDelay: "50",
        idlDelay: "200",
    });

    // Initialize Aeon
    console.log('Initializing Aeon...'); // Debugging log
    const aeon = new Aeon({ cortex, timestampFrom: Date.now(), segmantDuration: 500 });

    // Load managers
    console.log('Loading managers...'); // Debugging log
    const managersLoader = new ManagersLoader({ config, cache, cortex, oyster, aeon });
    const managers = managersLoader.load();

    // Start the user server
    console.log('Starting user server...'); // Debugging log
    managers.userServer.run();
};

// Start the application
startApp().catch((error) => {
    console.error('Error starting the application:', error);
    process.exit(1);
});