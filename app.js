const http = require('node:http');
const path = require('path');
const express = require('express');
const indexRoutes = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

// static files
app.use(express.static(path.join(__dirname, 'public')))

// use indexRoutes as main route
app.use('/', indexRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});