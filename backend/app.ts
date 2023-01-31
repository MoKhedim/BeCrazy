import express, { Request, response, Response } from 'express';
const { MongoClient, ServerApiVersion, Collection, Db, ObjectId } = require('mongodb');

//require setup
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var axios = require('axios');
const jwt = require("jsonwebtoken");

const secret = "dgjkgevuyetggvdghdfhegchgjdg,dvbmdghkdvghmdvhmshmg";

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
const collectionMediaComments = db.collection('mediaComments');
const collectionUsers = db.collection('users');


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

//route pour sign up
//http://localhost:3000/signup
//exemple body :
// {
//     "username":"password2",
//     "email": "password2@password.com",
//     "password": "password2"
// }
app.post('/signup', async (req: Request, res: Response) => {
    const today = new Date();
    const { username, email } = req.body;
    const password = bcrypt.hashSync(req.body.password, saltRounds);
    try {
        const verifEmail = await collectionUsers.findOne({ email: req.body.email });
        if (verifEmail) {
            res.send("email already exist");
        } else {
            const verifUsername = await collectionUsers.findOne({ username: req.body.username });
            if (verifUsername) {
                res.send("username already exist");
            } else {
                const result = await collectionUsers.insertOne({ username, email, password, created: today, token: "", nbFollows: 0, nbFollowers: 0 });
                if (result) {
                    res.send("user created");
                } else {
                    res.send("user not created");
                }
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});




//route pour se connecter
//http://localhost:3000/login
//exemple body :
// {
//     "email": "password@password.com",
//     "password": "password"
// }
app.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await collectionUsers.findOne({ email: email });
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const payload = { id: user._id };
                const token = jwt.sign(payload, secret, { expiresIn: "1h" });
                const updatetoken = await collectionUsers.findOneAndUpdate({ email: email }, { $set: { token: token } });
                if (updatetoken) {
                    res.send({ message: "Successfully logged in", token: token });
                }
            } else {
                res.send("wrong password");
            }
        } else {
            res.send("wrong email");
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

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

//route pour likes/unlike les médias
//http://localhost:3000/likeMedia
//exemple body:
// {
//     "id":"63d2d579f214642039d8ef17",
//     "username": "password"
// }
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


//route pour commenter les médias
//http://localhost:3000/commentsMedia
//exemple body:
// {
//     "id":"63d2d579f214642039d8ef17",
//     "username": "password",
//     "comment": "ta video est nul"
// }
app.post('/commentsMedia', async (req, res) => {
    const { id, username, comment } = req.body;
    const addComment = { $inc: { nbComment: 1 } };
    try {
        const result1 = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(id) }, addComment);
        const result2 = await collectionMediaComments.insertOne({ _id: new ObjectId(id), username, comment });
        const results = [result1, result2]
        res.send(results);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//route pour supprimer un commentaire
//http://localhost:3000/deleteComments
//exemple body:
// {
//     "id":"63d2d579f214642039d8ef17",
//     "username": "password",
// }
app.post('/deleteComments', async (req, res) => {
    const { id, username } = req.body;
    const deleteComment = { $inc: { nbComment: -1 } };
    try {
        const result1 = await collectionMediaComments.deleteOne({ _id: new ObjectId(id), username });
        const result2 = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(id) }, deleteComment);
        const results = [result1, result2]
        res.send(results);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
);