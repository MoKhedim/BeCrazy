import express, { Request, response, Response } from 'express';
import MulterRequest from './models/MulterRequest';
const { MongoClient, ServerApiVersion, ObjectId , GridFSBucket, Db } = require('mongodb');
import { codeGenerator, html, transporter } from './forgetpassword/index';

//require setup
var bodyParser = require('body-parser');
var fs = require('fs');
var bcrypt = require('bcrypt');
var axios = require('axios');
var multer = require('multer');
const upload = multer({ dest: "uploads/" });
//express setup
var app = express();
const jwt = require("jsonwebtoken");
const secret = "dgjkgevuyetggvdghdfhegchgjdg,dvbmdghkdvghmdvhmshmg";//express setup
const saltRounds = 10;
var port = 4000;

//app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

var axios = require('axios');

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
//http://localhost:4000/signup
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

let dbClient:typeof MongoClient;
app.post('/postMedia', upload.single("video"), async (req:Request, res:Response) => {
  MongoClient.connect(uri, (err:Error, client:typeof MongoClient) => {
    if(err) {
      console.log(err);
      res.status(500).json({ message: 'Error connecting to MongoDB' });
      return;
    }
    dbClient = client;

    const collection = client.db("BeCrazy").collection("allMedia");
    const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
    const videoStream = fs.createReadStream((req as unknown as MulterRequest).file.path);
    const uploadStream = bucket.openUploadStream((req as unknown as MulterRequest).file.originalname);
    const { username, description } = req.body;

    collection.insertOne({
        username: "MoKhedim",
        description: description,
        videoId: uploadStream.id,
    }, (err:any, result:any) => {
        if(err) {
            console.log(err);
            return;
        }
    }
    );

    videoStream.pipe(uploadStream)
    .on('error', (error:any) => {
        console.log(error);
        res.status(500).json({ message: 'Error uploading video' });
    })
    .on('finish', (file:any) => {
        fs.unlinkSync((req as unknown as MulterRequest).file.path);
        res.status(200).json({ message: 'Video uploaded successfully' });
        dbClient.close(); // close the connection once the operation is finished
        res.send(file.id);
    });

  });
});

app.get('/getMedia/:id', (req:Request, res:Response) => {
    MongoClient.connect(uri, (err:Error, client:typeof MongoClient) => {
        if(err) {
            console.log(err);
            res.status(500).json({ message: 'Error connecting to MongoDB' });
            return;
        }
        dbClient = client;
        const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
        const downloadStream = bucket.openDownloadStream(ObjectId(req.params.id));
        downloadStream.pipe(res); 
        //send the video to the upload folder
        downloadStream.on('error', (error:any) => {
            console.log(error);
            res.status(500).json({ message: 'Error downloading video' });
        }
        );
        downloadStream.on('finish', () => {
            res.status(200).json({ message: 'Video downloaded successfully' });
            dbClient.close(); // close the connection once the operation is finished
        }
        );
    });
});

app.delete('/deleteMedia/:id', (req:Request, res:Response) => {
    MongoClient.connect(uri, (err:Error, client:typeof MongoClient) => {
        if(err) {
            console.log(err);
            res.status(500).json({ message: 'Error connecting to MongoDB' });
            return;
        }
        dbClient = client;
        const collection = client.db("BeCrazy").collection("allMedia");
        const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });

        collection.deleteOne({ videoId: ObjectId(req.params.id) }, (err:any, result:any) => {
            if(err) {
                console.log(err);
                return;
            }
        }
        );
        bucket.delete(ObjectId(req.params.id), (err:any) => {
            if(err) {
                console.log(err);
                res.status(500).json({ message: 'Error deleting video' });
                return;
            }
            res.status(200).json({ message: 'Video deleted successfully' });
            dbClient.close(); // close the connection once the operation is finished
        });
    });
});


app.get('/getAllMedia', (req:Request, res:Response) => {
    MongoClient.connect(uri, (err:Error, client:typeof MongoClient) => {
        if(err) {
            console.log(err);
            res.status(500).json({ message: 'Error connecting to MongoDB' });
            return;
        }
        dbClient = client;
        const collection = client.db("BeCrazy").collection("allMedia");
        collection.find().toArray((err:any, result:any) => {
            if(err) {
                console.log(err);
                return;
            }
            res.send(result);
        });
    });
});


app.get('/getMediaUser/:username', (req:Request, res:Response) => {
    MongoClient.connect(uri, (err:Error, client:typeof MongoClient) => {
        if(err) {
            console.log(err);
            res.status(500).json({ message: 'Error connecting to MongoDB' });
            return;
        }
        dbClient = client;
        const collection = client.db("BeCrazy").collection("allMedia");
        collection.find({ username: req.params.username }).toArray((err:any, result:any) => {
            if(err) {
                console.log(err);
                return;
            }
            res.send(result);
        });
    });
});


//route pour likes/unlike les médias
//http://localhost:3000/likeMedia
//exemple body:
// {
//     "id":"63d2d579f214642039d8ef17",
//     "username": "password"
// }
app.post('/likeMedia', async (req: Request, res: Response) => {
    const { id, username } = req.body;
    const likes = { $inc: { nbLike: 1 } };
    const dislikes = { $inc: { nbLike: -1 } };
    try {
        const alreadyLike = await collectionMediaLikes.findOne({ _id: new ObjectId(id) }, { username: username });
        if (alreadyLike) {
            //si l'utilisateur a déjà liké la photo, on supprime le like dans les 2 tables
            const result1 = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(id) }, dislikes);
            if (result1.value) {
                const result2 = await collectionMediaLikes.deleteOne({ _id: new ObjectId(id), username });
                res.status(200).json({ message: "Succès!", result1, result2 });
            } else {
                res.status(400).json({ message: "Erreur!", result1 });
            }
        } else {
            //sinon on ajoute le like dans les 2 tables
            const result1 = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(id) }, likes);
            if (result1.value) {
                const result2 = await collectionMediaLikes.insertOne({ _id: new ObjectId(id), username });
                res.status(200).json({ message: "Succès!", result1, result2 });
            } else {
                res.status(400).json({ message: "Erreur!", result1 });
            }
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
app.post('/commentsMedia', async (req: Request, res: Response) => {
    const { id, username, comment } = req.body;
    const addComment = { $inc: { nbComment: 1 } };
    try {
        const result1 = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(id) }, addComment);
        if (result1.value) {
            const result2 = await collectionMediaComments.insertOne({ _id: new ObjectId(id), username, comment });
            res.status(200).json({ message: "Succès!", result1, result2 });
        } else {
            res.status(400).json({ message: "Erreur!", result1 });
        }
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
app.post('/deleteComments', async (req: Request, res: Response) => {
    const { id, username } = req.body;
    const deleteComment = { $inc: { nbComment: -1 } };
    try {
        const result1 = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(id) }, deleteComment);
        if (result1.value) {
            const result2 = await collectionMediaComments.deleteOne({ _id: new ObjectId(id), username });
            res.status(200).json({ message: "Succès!", result1, result2 });
        } else {
            res.status(400).json({ message: "Erreur", result1 });
        }

    }
    catch (err) {
        res.status(500).send(err);
    }
});


//route pour mdp oublié
//http://localhost:3000/forgotpassword
//exemple body:
// {
//     "email": "password@password.com"
// }
//route pour vérifier si le email existe vraiment dans la BD.
app.post("/forgotpassword", async (req: Request, res: Response) => {
    const email = req.body.email;

    var mailOptions = {
        from: 'becrazy815@gmail.com',
        to: `${email}`,
        subject: 'Verification code',
        text: `CODE : ${codeGenerator}`,
        html: `${html}`
    }
    try {
        const verifEmailExist = await collectionUsers.findOne({ email: email });
        if (verifEmailExist) {
            transporter.sendMail(mailOptions, function (error: Error, info: any) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.status(200).json({ message: "Email envoyé avec succes!" })
        } else {
            res.status(400).json({ message: "Email non existant." })
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});



//route pour vérifié si le code correspond au code envoyé VIA email.
//http://localhost:3000/verifCode/bastiencambray975@gmail.com
// {
//     "code": "28508",
//     "newpassword": "password"
// }
app.post("/verifCode/:email", async (req: Request, res: Response) => {
    const code = req.body.code;
    const newpassword = bcrypt.hashSync(req.body.newpassword, saltRounds);
    const email = req.params.email;
    if (code == codeGenerator) {
        try {
            const result = await collectionUsers.findOneAndUpdate({ email: email }, { $set: { password: newpassword } });
            if (result.value) {
                res.status(200).json({ message: "Mot de passe modifié avec succes!", result });
            } else {
                res.status(400).json({ message: "Erreur lors de la modification du mot de passe.", result });
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(400).json({ message: "Code incorrect." })
    }
});

//route pour obtenir le top 10 des médias ayant eu le plus de like dans la journée en cours.
// http://localhost:3000/top10media
app.get('/top10media', async (req: Request, res: Response) => {
    const today = new Date();
    const date = today.toISOString().substr(0, 10);
    try {
        const result = await collectionAllMedia.find({ created: { $regex: `^${date}` } }).sort({ nbLike: -1 }).limit(10).toArray();
        res.send(result);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//route pour rechercher un user par une partie de son username
//http://localhost:3000/searchUser/bas
app.get('/searchUser/:username', async (req: Request, res: Response) => {
    const username = req.params.username;
    try {
        const result = await collectionUsers.find({ username: { $regex: `^${username}` } }).toArray();
        res.send(result);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//route pour rechercher un user par une partie de son username
//http://localhost:3000/userProfil/bastien
app.get('/userProfil/:username', async (req: Request, res: Response) => {
    const username = req.params.username;
    try {
        const result = await collectionUsers.find({ username: username  }).toArray();
        res.send(result);
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