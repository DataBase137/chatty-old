const { Server } = require("socket.io");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const io = new Server(7000, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", async (socket) => {
    const logs = await prisma.chat.findMany({
        select: {
            id: true,
            text: true,
            created_at: true
        }
    });
    socket.emit("got-logs", logs);

    socket.on("message-sent", async (text) => {
        const log = await prisma.chat.create({
            data: {
                text
            }
        });
        socket.emit("message-recieved", log);
    });
});