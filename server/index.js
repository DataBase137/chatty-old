const express = require("express");
const app = express();
const cors = require("cors");
const { sendLogRoute } = require('./chat.controller');

app.use(express.json({ limit: '2.5mb' }));
app.use(cors({ origin: "http://localhost:3000" }));

app.post('/sendlog', sendLogRoute);

app.listen(3001, () => console.log("Server started on port 3001"));