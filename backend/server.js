const express = require('express');
const app = express();
const session = require('express-session');

// Middleware
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
}));
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.use(express.static('../frontend'));  // Fixed path to frontend

// Import routes
const authRoutes = require('./routes/auth');  // Fixed path
const fileRoutes = require('./routes/files'); // Fixed path  
const userRoutes = require('./routes/users'); // Fixed path

// Use routes
app.use('/api', authRoutes);
app.use('/api', fileRoutes);
app.use('/api', userRoutes);
// User info route
app.get('/api/user-info', (req, res) => {
    if (!req.session.userId) {
        return res.json({ success: false });
    }

    // You'll need to implement getUserById in your database.js
    db.getUserById(req.session.userId, (err, user) => {
        if (err || !user) {
            return res.json({ success: false });
        }
        res.json({ success: true, user: { name: user.name, email: user.email } });
    });
});

// Logout route
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
});
// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});