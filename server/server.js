const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

app.use(cors());
// Path of csvFile to read
let pathToCsv = "/../";
// Array we fill with all Betriebsstellen
const bsvArray = [];

const seperator = ";";

// we use this function to let the server generate the filepath
function findFile(startPath, filter) {
    if (!fs.existsSync(startPath)) {
        return;
    }
    const files = fs.readdirSync(startPath);
    const filename = path.join(startPath, files[0]);

    if (filename.endsWith(filter)) {
        pathToCsv += filename;
    }
}

findFile("./files", ".csv");

fs.readFile(__dirname + pathToCsv, "utf8", (err, data) => {
    if (err) {
        return console.log("Error: ", err);
    }

    // Array with each csv line as a string
    const lineArray = data.split("\r\n");

    // array with every header as a single entry
    const headerArray = lineArray[0].split(seperator);

    // creating new objects for every Betriebsstelle and pushing them
    // to bsvArray after filling with key - value pairs
    lineArray.forEach((element, index) => {
        if (index == 0) {
            return;
            // lineArray[0] are the csv headers. we filter them out in this if-clause.
        } else if (element !== "") {
            const betriebsstelleArray = element.split(";");
            const betriebsstelle = {};

            for (let i = 0; i < betriebsstelleArray.length; i++) {
                betriebsstelle[headerArray[i]] = betriebsstelleArray[i];
            }
            bsvArray.push(betriebsstelle);
        }
    });
});

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
