const app = require('express')();

app.get('/', (req, res) => {
    res.send({ hi: 'friend' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);