// server.js
const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Import database helpers
const db = require('./database'); // your database.js file

// Import route modules
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const userRoutes = require('./routes/users');

// Middleware
app.use(express.json());
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Set to true if using HTTPS
    })
);

// Mount API routes
app.use('/api', authRoutes);
app.use('/api', fileRoutes);
app.use('/api', userRoutes);

// Get current user info
app.get('/api/user-info', (req, res) => {
    if (!req.session.userId) return res.json({ success: false });

    db.getUserById(req.session.userId, (err, user) => {
        if (err || !user) return res.json({ success: false });
        res.json({ success: true, user: { name: user.name, email: user.email } });
    });
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});

// Test DB connection at startup
db.pool
    .connect()
    .then(() => console.log('✅ POSTGRES DATABASE CONNECTED SUCCESSFULLY!'))
    .catch(err => console.error('❌ DATABASE CONNECTION FAILED:', err));

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
