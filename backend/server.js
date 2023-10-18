const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

dotenv.config({path:'config/config.env'})

connectDatabase();

// Handling uncaught error
process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log('shutting down the server due to uncaght error');
    process.exit(1);
});



const server = app.listen(process.env.PORT,(err)=>{
    console.log('server is running on port ',process.env.PORT);
})

// unhandled promise rejection
process.on('unhandledRejection',err=>{
    console.log(`Error ${err.message}`);
    console.log('shutting down the server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    });
});