const express = require('express');
require('dotenv').config(); 
const authRoute = require('./routes/authRoutes');
const todoRoute = require('./routes/todoRoutes');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./config/database');
 
const app = express();
 

connectDB();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
 
app.use('/api/auth', authRoute);
app.use('/api/todo', todoRoute);
 
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).send({
        success: false,
        statusCode,
        message,
    });
});

  
server.listen(process.env.PORT, () => {
    console.log(`Server is live on ${process.env.PORT}`);
});
