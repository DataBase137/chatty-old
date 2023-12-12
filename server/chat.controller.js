const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendLog = async (text) => {
    try {
        await prisma.chat.create({
            data: {
                text
            }
        });
    } catch (err) {
        console.error(err);
    }
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

module.exports = { sendLog, getLogs };