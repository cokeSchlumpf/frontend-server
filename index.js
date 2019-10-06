const express = require('express');
const proxy = require('http-proxy-stream');

const API_BASE_URL = process.env.SERVER_API_BASE_URL || 'http://localhost:8080';
const API_PATH_PREFIX = process.env.SERVER_API_PATH_PREFIX || '/api'
const PORT = process.env.SERVER_PORT || 3030;

/*
 * Configure express
 */
const app = express();
app.set('trust proxy', 1);

/*
 * Routes of application
 */
app.use(API_PATH_PREFIX, function (req, res) {
    proxy(req, { url: `${API_BASE_URL}${req.originalUrl}` }, res);
});

app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

/*
 * Start server
 */
app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT + '!');
});