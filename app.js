const express = require('express');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const adminRoutes = require('./routes/v1/admin.routes');
const userRoutes = require('./routes/v1/user.routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;