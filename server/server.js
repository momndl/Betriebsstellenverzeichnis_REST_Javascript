const express = require("express");
const app = express();
const fs = require("fs");
const PORT = process.env.PORT || 3001;

// Path of csvFile to read
const path = "/../files/bsv_2021_10.csv";
// Array with all Betriebsstellen
const bsvArray = [];

fs.readFile(__dirname + path, "utf8", (err, data) => {
    if (err) {
        return console.log("Error: ", err);
    }

    // Array with each csv line as a string
    const lineArray = data.split("\r\n");

    // array with every header as a single entry
    const headerArray = lineArray[0].split(";");

    // creating new objects for every Betriebsstelle and pushing them
    // to bsvArray
    lineArray.forEach((element) => {
        const betriebsstelleArray = element.split(";");
        const betriebsstelle = {};

        for (let i = 0; i < betriebsstelleArray.length; i++) {
            betriebsstelle[headerArray[i]] = betriebsstelleArray[i];
        }

        bsvArray.push(betriebsstelle);
    });

    // no need for first entry
    bsvArray.shift();
});

//app.use(express.json());

app.get("/betriebsstellen/:rl100", (req, res) => {
    const { rl100 } = req.params;

    for (let i = 0; i < bsvArray.length; i++) {
        if (bsvArray[i]["RL100-Code"] === rl100) {
            return res.json(bsvArray[i]);
        }
    }
    return res.status(404).json("RL100-Code unknown");
});

app.get("*", function (req, res) {
    return res
        .status(404)
        .json("Error, please ask your Webmaster for API documentation.");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
