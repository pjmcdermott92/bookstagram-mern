if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const app = express();

const PORT = process.env.PORT || 5550;
const API_PREFIX = '/api/v1';

require('./config/connectDB')();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(helmet());

// Routes
app.use(`${API_PREFIX}/users`, require('./routes/userRoutes'));
app.use(`${API_PREFIX}/posts`, require('./routes/postRoutes'));

// Serve Client App in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html')));
} else {
    app.get('*', (req, res) => res.send('Set to production to run client'));
}

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} on Port ${PORT}...`));
