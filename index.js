const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
let demo_discs = require("./demo_disc_data.js");

const PORT = 8000;

//Pre-route middleware
morgan.token("post-body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-body"));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//ROUTES
//GET
app.get("/api/discs", (req, res) => {
    res.json(demo_discs);
});

app.get("/api/disc/:id", (req, res) => {
    const id = req.params.id;
    const disc = demo_discs.find(d => d.id === id);

    if(disc){
        res.json(disc);
    } else {
        res.status(404).end("404 - Disc Not Found");
    }
});

//POST
app.post("/api/discs/", (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({ 
            error: 'Malformed request: no body' 
        })
    } else if(!body['id'] || !body['title'] || !body['release_date'] || !body['description']) {
        return res.status(400).json({
            error: 'missing content - (include: id, title, release_date, description)'
        });
    } else if(demo_discs.find(d => d.id === body.id)){
        return res.status(400).json({
            error: 'ID must be unique'
        });
    }
    const entry = {
        id: body.id,
        title: body.title,
        release_date: new Date(body.release_date),
        description: body.description
    }
    demo_discs = demo_discs.concat(entry)
    console.log(demo_discs)
    res.send(entry)
});

//Middleware enabled after routes will be processed after them.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(process.env.PORT || PORT, () => console.log(`Running on port: ${PORT}`));