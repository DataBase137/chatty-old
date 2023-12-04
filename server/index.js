const express = require("express");
const app = express();
const { getLogsRoute } = require('./chat.controller');

app.post('/getlogs', getLogsRoute);

app.listen(3001, () => console.log("Server started on port 3001"));