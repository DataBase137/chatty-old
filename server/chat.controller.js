const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendLogRoute = async (req, res) => {
    const text = req.body.text;

    try {
        await prisma.chat.create({
            data: {
                text
            }
        });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err });
    };
}

const getLogsRoute = async (req, res) => {
    try {
        const chatlogs = await prisma.chat.findMany({
            select: {
                id: true,
                text: true,
                created_at: true
            }
        });
        res.status(200).json({ success: true, chatlogs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
}

module.exports = { sendLogRoute, getLogsRoute };