require('./initSentry');

const Sentry = require('@sentry/node');
const express = require('express');
const app = express();

// Maak een eenvoudige route die 'Hello World' retourneert
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

Sentry.setupExpressErrorHandler(app);

app.use('onError', (err, req, res, next) => {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

// Luister op poort 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});