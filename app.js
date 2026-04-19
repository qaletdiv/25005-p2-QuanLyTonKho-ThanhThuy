require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./models');
const app = express();
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const productRoutes = require('./routes/product');
const stockRoutes = require('./routes/stock');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'abc123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } 
}));

app.use('/', authRoutes);
app.use('/', orderRoutes);
app.use('/', productRoutes);
app.use('/', stockRoutes);
app.get('/', (req, res) => {
    res.redirect('/login');
});

const PORT = 3000;
db.sequelize.authenticate()
    .then(() => {
        console.log('Kết nối database thành công!');
        app.listen(PORT, () => {
            console.log('Server đang chạy trên cổng ' + PORT);
        });
    })
    .catch(err => {
        console.error('Lỗi kết nối database:', err);
    });