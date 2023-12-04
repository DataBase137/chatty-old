const getLogsRoute = async (req, res) => {
    const text = req.text;
    try {
        console.log(text);
    } catch (err) {
        console.log(err);
    };
}