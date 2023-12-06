const express = require("express");
const app = express();
const cors = require("cors");
const { sendLogRoute, getLogsRoute } = require('./chat.controller');

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "2.5mb" }));

app.post('/sendlog', sendLogRoute);
app.post('/getlogs', getLogsRoute);

app.listen(8000, () => console.log("Server started on port 8000"));