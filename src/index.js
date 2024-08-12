const express = require('express');

const app = express();
const PORT = 7070;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})