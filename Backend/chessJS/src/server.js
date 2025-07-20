require('dotenv').config();
const express = require('express'); 
const http = require('http');
const socketIo = require('socket.io');  
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');    
const morgan = require('morgan');
const helmet = require('helmet');   
const path = require('path');
const { setupSocket } = require('./socket');
const { logger } = require('./utils/logger');
const routes = require ('./routes');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);


mongoose.connect(process.env.MONGO_URI, {
    userNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => {
    logger.error('MongoDB Connection Error:',err);
    process.exit (1);   
});


mongoose.connection.on('error', err => {
    logger.error('MongoDB Connection Error:', err); 

});

mongoose.connection.on('disconnected', () => { 
    logger.warn('MongoDB disconnected, attempting to reconnect...');    
});


mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
});


app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "wss:", "ws:"]
      }
    }
  }));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60, // 
        autoRemove: 'native', // Automatically remove expired sessions
        touchAfter: 24* 3600
    
    }),
    cookie: {
        secure: process.env.NODE_ENV ===    'production',
        maxAge: 24 * 60 * 60 * 1000

    }
});

app.use(sessionMiddleware);

io.engine.use(sessionMiddleware);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', routes);

setupSocket(io);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });
  
  // Start server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  }); 


  