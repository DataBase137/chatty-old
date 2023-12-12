const { sendLog, getLogs } = require('./chat.controller');
const { Server } = require("socket.io");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const io = new Server(7000, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("message-sent", (text) => {
        sendLog(text);
        console.log("message sent!", text);
    });

    socket.on("get-logs", async () => {
        const logs = await getLogs();
        console.log(logs);
        socket.emit("got-logs", logs)
    })
});