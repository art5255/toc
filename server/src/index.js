const express = require("express");
const logger = require("morgan");
const request = require("request");

const app = express();

const HOST = "0.0.0.0";
const PORT = 9200;

app.set("host", "0.0.0.0");
app.set("port", 9200);

app.use(logger("dev"));

app.get("/api/toc", getTocItems);

function getTocItems(req, res) {
    request("https://www.jetbrains.com/help/idea/2019.3/HelpTOC.json").pipe(res);
}

app.use((req, res) => {
    console.error(req);
    res.status(500).send("Server Error");
});

app.listen(app.get("port"), () => {
    console.log(`App is running at ${HOST}:${PORT}`);
});

module.exports = app;