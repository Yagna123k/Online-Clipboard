const express = require("express")
const cors = require('cors')

const app = express()
app.use(express.json())

app.use(cors({
    origin: ['http://localhost:5173', 'https://clipboard-x.vercel.app', 'https://clipsync-x.vercel.app'],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
}));

const connectMongoDB = require("./DataBase/ConnectMongoDB")
connectMongoDB()

const clipboardRoutes = require('./routes/clipboardRoutes');
app.use('/clipboard', clipboardRoutes);


app.get("/", (req, res) => {
    res.send("Online Clipboard server is working..🥳")
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));