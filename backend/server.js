const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const executeRoute = require("./routes/execute");
const submitRoute = require("./routes/submit");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/execute", executeRoute);
app.use("/api/submit", submitRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Online Code Judge API is running!"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
    }
};

startServer();