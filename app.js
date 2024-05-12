require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000; 
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(cookieParser());
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/route'))

app.use((request, response, next) => {
    response.status(404).send("404 Not Found");
});

app.listen(port, ()=> {
  console.log(`App listeing on port ${port}`)
});