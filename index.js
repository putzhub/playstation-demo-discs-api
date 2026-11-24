const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const demo_discs = require("./demo_disc_data.js");

const PORT = 8000;

//Pre-route middleware
morgan.token("post-body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-body"));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//ROUTES

//Middleware enabled after routes will be processed after them.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(process.env.PORT || PORT, () => console.log(`Running on port: ${PORT}`));