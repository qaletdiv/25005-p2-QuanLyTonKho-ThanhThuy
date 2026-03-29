const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/', (req,res) => {
    res.redirect('/login');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server đang chạy trên cổng ' + PORT);
});