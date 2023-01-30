import express, { Request, response, Response } from 'express';
const { MongoClient, ServerApiVersion, Collection, Db, ObjectId } = require('mongodb');

//require setup
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var axios = require('axios');

//express setup
var app = express();
const saltRounds = 10;
var port = 3000;

//app.use
app.use(bodyParser.json());

//MONGO DB SETUP
const uri = "mongodb+srv://Bastien:Bastien975@projetbecrazy.h0ghj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, (err: any, client: any) => {
    if (err) {
        console.log(err);
        return;
    }
});
const db: typeof Db = client.db('BeCrazy');
const collectionAllMedia = db.collection('allMedia');
const collectionMediaLikes = db.collection('mediaLikes');


//openai setup
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: "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"
});
const openai = new OpenAIApi(configuration);

async function getCompletion() {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Donne moi un défi drôle à prendre en photo ou video que quelqun pourrait prendre avec son téléphone en 1 phrase.",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return response.data.choices[0].text;
}

//routes with ts type
app.post('/signup', (req: Request, res: Response) => {
    const today = new Date();
    const body = JSON.stringify(req.body);
    console.log(body);
    var data = JSON.stringify({
        "collection": "users",
        "database": "BeCrazy",
        "dataSource": "ProjetBeCrazy",
        "document": {
            "username": req.body.username,
            "email": req.body.email,
            "password": bcrypt.hashSync(req.body.password, saltRounds),
            "created": today
        }
    });
    var config = {
        method: 'post',
        url: 'https://data.mongodb-api.com/app/data-diwam/endpoint/data/v1/action/insertOne',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': 'dneyLnyUcz1yBENLpVoHBMDo2rLn0S30yoOv3fVby1r5kFWK889gRSY03dybnrtV',
            'Accept': 'application/ejson'
        },
        data: data
    };
    axios(config)
        .then(function (response: any) {
            console.log(JSON.stringify(response.data));
            res.send(response.data);
        })
        .catch(function (error: any) {
            console.log(error);
            res.send(error);
        });
}
);

// app.post("/login", async (req: Request, res: Response) => {
//     try {
//         await client.connect();
//         const collection = client.db("BeCrazy").collection("users") as Collection<Users>;
//         const user = await collection.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }
//         if (!compareSync(req.body.password, user.password)) {
//             return res.status(401).json({ message: "Invalid email or password" });
//         }
//         return res.json({ message: "Logged in successfully", user });
//     } catch (err) {
//         res.status(500).json({ message: "Error while logging in", error: err });
//     } finally {
//         client.close();
//     }
// });

app.get("/aiChallenge", (req: Request, res: Response) => {
    getCompletion().then((response: any) => {
        console.log(response);
        res.send(response);
    }
    ).catch((error: any) => {
        console.log(error);
    }
    );
});

app.post('/postMedia', (req: Request, res: Response) => {
    const today = new Date();
    const body = JSON.stringify(req.body);
    console.log(body);
    var data = JSON.stringify({
        "collection": "allMedia",
        "database": "BeCrazy",
        "dataSource": "ProjetBeCrazy",
        "document": {
            "username": req.body.username,
            "source": req.body.source,
            "description": req.body.description,
            "nbLike": 0,
            "nbComment": 0,
            "created": today
        }
    });
    var config = {
        method: 'post',
        url: 'https://data.mongodb-api.com/app/data-diwam/endpoint/data/v1/action/insertOne',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': 'dneyLnyUcz1yBENLpVoHBMDo2rLn0S30yoOv3fVby1r5kFWK889gRSY03dybnrtV',
            'Accept': 'application/ejson'
        },
        data: data
    };
    axios(config)
        .then(function (response: any) {
            console.log(JSON.stringify(response.data));
            res.send(response.data);
        })
        .catch(function (error: any) {
            console.log(error);
        });
}
);

app.post('/likeMedia', async (req, res) => {
    const { id, username } = req.body;
    const likes = { $inc: { nbLike: 1 } };
    const dislikes = { $inc: { nbLike: -1 } };
    try {
        const alreadyLike = await collectionMediaLikes.findOne({ _id: new ObjectId(id) }, { username: username });
        if (alreadyLike) {
            //si l'utilisateur a déjà liké la photo, on supprime le like dans les 2 tables
            const result1 = await collectionMediaLikes.deleteOne({ _id: new ObjectId(id), username });
            const result2 = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(id) }, dislikes);
            const results = [result1, result2]
            res.send(results);
        } else {
            //sinon on ajoute le like dans les 2 tables
            const result1 = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(id) }, likes);
            const result2 = await collectionMediaLikes.insertOne({ _id: new ObjectId(id), username });
            const results = [result1, result2]
            res.send(results);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


//listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
);