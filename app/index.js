const express = require('express');
const path = require('path');
const app = express(); app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
}); const port = 8765;
app.listen(port, () => {
    console.log(`listening http://localhost:${port}`);
}); 