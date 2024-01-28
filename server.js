const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Welcome to the TripSquad API');
});

app.listen(port, () => {
    console.log(`[server]: TripSquad API started on port: ${port}`);
});
