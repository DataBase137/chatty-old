const { Server } = require("socket.io");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendLog = async (text) => {
    const log = await prisma.chat.create({
        data: {
            text
        }
    });
    return log;
}

const getLogs = async () => {
    const logs = await prisma.chat.findMany({
        select: {
            id: true,
            text: true,
            created_at: true
        }
    });
    return logs;
}

const io = new Server(7000, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", async (socket) => {
    const logs = await getLogs();
    socket.emit("got-logs", logs)

    socket.on("message-sent", (text) => {
        // const log = await sendLog(text);
        socket.broadcast.emit("message-recieved", text);
    });
});