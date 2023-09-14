// imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require("./routes");
var cors = require("cors");
const dbpassword = require("./dbconfig");

// config variables
const port = 8080;

app.use(cors());
app.use(express.json());
app.use("/", routes);

// connect mongo database
mongoose
    .connect(
        `mongodb+srv://louisd:${dbpassword}@finmon.6cxsdpe.mongodb.net/admin?authSource=admin&replicaSet=atlas-3r8sxc-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("[+] Successfully connected to mongoDB"));

// create server
app.listen(port, () => {
    console.log("[+] Server has started ...");
});
