const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sendLogRoute = async (req, res) => {
    const text = req.text;

    try {
        console.log(text);
        const chatlogs = await prisma.chatlogs.create({
            data: {
                text: text
            }
        });
        res.status(200).json({ success: true })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err });
        return;
    };
}

module.exports = { sendLogRoute };