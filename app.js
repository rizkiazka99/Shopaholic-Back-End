require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(routes);

app.listen(port, () => {
    console.log(`App is listening on PORT ${port}`);
});