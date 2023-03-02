import express, { Request, response, Response } from 'express';
const { MongoClient, ServerApiVersion, ObjectId, GridFSBucket, Db } = require('mongodb');
import { codeGenerator, html, transporter } from './forgetpassword/index';
import MulterRequest from './models/MulterRequest';
import Users from './models/Users';
import * as dotenv from 'dotenv';


//require setup\\
dotenv.config() //load .env file
var bodyParser = require('body-parser');
var fs = require('fs');
var bcrypt = require('bcrypt');
var multer = require('multer');
const upload = multer({ dest: "uploads/" });
//express setup
var app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const ffmpeg = require('fluent-ffmpeg');
const secret = "dgjkgevuyetggvdghdfhegchgjdg,dvbmdghkdvghmdvhmshmg";//express setup
const saltRounds = 10;
const { Readable } = require('stream');
const port = process.env.PORT || 4000;
//app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://Bastien:Bastien975@projetbecrazy.h0ghj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, (err: any, client: any) => {
    if (err) {
        console.log(err);
        return;
    }
});
const db: typeof Db = client.db('BeCrazy');
const collectionAllMedia: any = db.collection('allMedia');
const collectionMediaLikes: any = db.collection('mediaLikes');
const collectionMediaComments: any = db.collection('mediaComments');
const collectionUsers: any = db.collection('users');

//openai setup
const { Configuration, OpenAIApi } = require("openai");
const configuration: any = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai: any = new OpenAIApi(configuration);

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
    console.log(response.data.choices[0].text);
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
    const user: Users = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds),
        bio: "this is a bio",
        profilePicture: "",
        created: today,
        token: "",
        nbFollows: 0,
        nbFollowers: 0
    }
    const profilepicDefault: String = "data:image/jpeg;base64,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D//aAAwDAQACAAMAAAAQ8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888w8888888888888888888888888888888888888888888888888888888888888888888884UwAI48888888888888888888888g88888sw888888888888888888884c8888888o8888888888888888888g8888888848888888888888888884Y888888888U888888888888888888U8888848888888888888888888888U8884M8Y88c88888888888888888sU884c88808c88888888888888888sU80c8888s0c888888888888888888c4c888888cI888888888888888888ko884w884M88888888888888888888MM0IIwUs888888888888888888888888888888888888888w88888888888w88U0s888888888888888888888EYIAAAAc8k888888888888888888w888sMM888800888888888888888gU88888888888I888888888888880AQ888888888888Y888888M888884kAAU88888888884Qc888888888884oAAQ8888888888gAM88888888888IoAAAU88888888gAA0c888888888o0oAAAQ8888888gAAAos8888w8888gcgAAAA8888888AAAAg8g8888//EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQMBAT8QUn//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAECAQE/EFJ//8QALBABAAEDAQYHAQEAAwEAAAAAAREAITFBQFBRYXGBECAwkaGxwfDRcIDh8f/aAAgBAQABPxD/ALj3/wCewdaFEhTCTWSLU2ksTRfnHCoqMtInzKvYqDhwpbHPg+/1TILcQntdRJjzq/jipLzRRonSgdd3WWvZ454zjWacB45LO6kSXR7VeC1lBjsT28nXxGDFpD6WpA0t4BGbpwo0EZpCPG1dqXLhb/N2POowp3Mjl+fnicVPkk4UvAn3W/x5ZqfKl7ZiGU6/0lEPl3BJcBuacpbnAJLjuqeiRlzAf59G9qsXPJLGC3Ijp6ooIiXOVTpXDyQi+/ba5fMtO553irW0oJ0f+CmSsKaRY5QNvd9drRy0IHIl5HFAEB6uRHq+bcKcgXjG5soYvRh62VownyM5dhMSp2KXZS+sx7UV40bmDDcWk7b7/FPtG6VEq85zsJP3UiS8ZZly7PRG5hDNzExJlxx2LKnz4WM29lkq5bk4VPw3dofRNldNiYkATQf+0IxCMzGh1zU4Y6biKEEsN/ppSNSUyvOovsRUhi6HrB2rDu3CaTTFJa9RF3T/ADYymWth9ZG4nCrbNIpf62Z7049WePmKWfs6/wAuLuPWoLT4UH+049OfE8pmjG4X7p/NyfyNcpx6LnzHkKl2YXuzcn9ngpx6D6n87jrM6bjXnXvWpx559VYmhz0/astw8KhhyrBl891q7GVdX7aH6dxGk0xSG8W+2WSK/wAfmxFGDrUYUdPj277khi4MQuVMriqIMPtCUeN8etr4AEEqhLIF53FIsSbksvoj0Rl0i3UijYTXpTii886hbvrrF6uDhUtgNc7kaNZzszJqR71KYXoRFA8C1zI28J9c4I7ypEAar9tMEsEDJjifYuCxuXOKhYt76B0S7PvmGlLBrdYk6mlrPEq3mioqPM+mIny8g6e1FGg0iFsnNOeC3XdEUrkGUM626a1YZ5YqXxDf751HWTBLTgF1ubVsePau1RUeM0+Kii2DWCtTUMAzyT1elYzhRYL0A9t1S60KIGgYjtQCV7cUX1ml2deR/E0M8fEv+/lZpuZftOAquJU37on6qnxZcV+VqG5rD7hfmo4Cbo89MfFAZ/QJTfS2f+CZ2exr+VJrT4Q0cmuz3qHyBru5z2pjrUhcA3zmKkqMkv8AY44/5ypeSzSH/HMrrgf/ACZr5AP96GWH98afVOf/AGbUrAcuj3D7FPzp5VO8L7UwDi0wl63/AAUmNGGOHWK7O6RLC/tcrXb6GHjpHCbVJrcrE5tls2b0sBgTFBglv8+g+LEIIWRznM1/AsAb/cUkkM397PvD1pSAHIokL+7mJosF6gNLksRxpOkEfoEY5DjxpGRRVVzRXLnR52pp8gd+JbceLLpaczQDHyBVz2pyehUbjJ0qzDKiXhj5tBzLJSe5lpWf0eaaPI+gDUDIloqeowkLF7hpiYverYfAy6kWv77hkqgKDuVKOMTI7pr8ryuNa+jNT6WKKutiwb3WvtCVHGCS1kNvQyS2vi+3yMDRbiU/+TMRCl/oOi6A7QnZA7QfsP3NWYCPYV+vDfTUttsBNhE5ptRzkjWxxOnO5o0bTenZBvUJFwwDjnJUEIARjlpz12uyCaRSGaKkMdLl2ccZk2spJ/DFWmgveDPK5rItyuOPqy4Hp30q6kRexTc9W2Y6a02I2WZVXiy+R2g8EiaGRvhjhoOkG0Nre1QBtOdaSMpwm/VAekHmdnPCDKk2AZHklnlSIMi4ZMdZpzs9mYHlsfFY5tDpUeV2fr4kbGQNJ9GNJKc7PKu56MJ6kzHKBrh53adTrvQkjGt6e1JfzMyjZkCLOieK7TNZb67aeVEBXaiLqfJ77NpA4TVM9H0XaNLcaVBQiJnS9rofLZZ+F0vAi8ri0+DuBkggji40c5AmdLse2xuKIItvipnEqle3pu0GKFhlPzGGunY0SQT7MnK006dPF9B9c9EqYTALMqv0qEB19GfR41/K40dOni+i+qei0Y9Iw58P/9k=";
    try {
        const verifEmail: any = await collectionUsers.findOne({ email: user.email });
        if (verifEmail) {
            res.status(100).send("email already exist");
        } else {
            const verifUsername: any = await collectionUsers.findOne({ username: user.username });
            if (verifUsername) {
                res.status(100).send("username already exist");
            } else {
                const result: any = await collectionUsers.insertOne({ username: user.username, email: user.email, password: user.password, bio: user.bio, profilePicture: profilepicDefault, created: user.created, token: user.token, nbFollows: user.nbFollows, nbFollowers: user.nbFollowers });
                if (result) {
                    res.status(200).send("user created");
                } else {
                    res.status(500).send("user not created");
                }
            }
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


//route pour se connecter
//http://localhost:4000/login
//exemple body :
// {
//     "email": "password@password.com",
//     "password": "password"
// }
app.post("/login", async (req: Request, res: Response) => {
    const user: Users = {
        username: "",
        email: req.body.email,
        password: req.body.password,
        bio: "",
        profilePicture: "",
        created: new Date,
        token: "",
        nbFollows: 0,
        nbFollowers: 0
    }
    try {
        const findUser: any = await collectionUsers.findOne({ email: user.email });
        if (findUser) {
            const match: any = await bcrypt.compare(user.password, findUser.password);
            if (match) {
                const payload: any = { id: findUser._id };
                const token: string = jwt.sign(payload, secret, { expiresIn: "1h" });
                const updatetoken: any = await collectionUsers.findOneAndUpdate({ email: user.email }, { $set: { token: token } });
                if (updatetoken) {
                    res.status(200).send({ message: "Successfully logged in", token: token });
                }
            } else {
                res.status(400).send("wrong password");
            }
        } else {
            res.status(400).send("wrong email");
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post("/aiChallenge", async (req: Request, res: Response) => {
    getCompletion().then((result: any) => {
        res.status(200).send(result);
    }
    );
});

//http://localhost:4000/postMedia/:token
// form-data key :
// video: Select File
// description: description
app.post('/postMedia/:token', upload.single("video"), async (req: Request, res: Response) => {
    const token: string = req.params.token;
    const description: string = req.body.description;
    console.log("body:", req.body);
    const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
    console.log("file:", (req as unknown as MulterRequest).file);
    console.log("path:", (req as unknown as MulterRequest).file.path);
    console.log("originalname:", (req as unknown as MulterRequest).file.originalname);
    const videoStream = Readable.from(fs.createReadStream((req as unknown  as MulterRequest).file.path));
    const uploadStream = bucket.openUploadStream((req as unknown as MulterRequest).file.originalname);

    try {
        const verifytoken: any = await collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username: string = verifytoken.username;
            console.log("Inserting data into database:", { username, description, videoId: uploadStream.id });
            collectionAllMedia.insertOne({
                username: username,
                description: description,
                videoId: uploadStream.id,
                created: new Date,
                nbLikes: 0,
                nbComments: 0
            });
            videoStream.pipe(uploadStream)
                .on('error', (error: any) => {
                    console.log(error);
                    res.status(500).json({ message: 'Error uploading video' });
                })
                .on('finish', (file: any) => {
                    fs.unlinkSync((req as unknown as MulterRequest).file.path);
                    res.status(200).json({ message: 'Video uploaded successfully' });
                    res.send(file.id);
                });
        } else {
            res.status(400).json({ message: 'Wrong token' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error uploading video' });
    }
});

app.get('/getMedia/:id', (req: Request, res: Response) => {
    const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
    const downloadStream = bucket.openDownloadStream(new ObjectId(req.params.id));
    downloadStream.pipe(res);

    //send the video to the upload folder
    downloadStream.on('error', (error: any) => {
        console.log(error);
        res.status(500).json({ message: 'Error downloading video' });
    }
    );
    downloadStream.on('finish', () => {
        const video = ffmpeg('uploads/' + (req as unknown as MulterRequest).file.originalname);
        video.toFormat('mp4').save('uploads/' + (req as unknown as MulterRequest).file.originalname + '.mp4');
        const upload = multer({ dest: 'uploads/' });
        res.status(200).json({ message: 'Video downloaded successfully' });
    }
    );
});

//http://localhost:4000/deleteMedia/:id/:token
app.delete('/deleteMedia/:id/:token', async (req: Request, res: Response) => {
    const token: string = req.params.token;
    const id = req.params.id;
    try {
        const verifytoken: any = await collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username = verifytoken.username;
            const verifyMediaUser = await collectionAllMedia.findOne({ videoId: new ObjectId(id), username: username });
            if (verifyMediaUser) {
                const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
                await collectionAllMedia.deleteOne({ videoId: new ObjectId(id) });
                await bucket.delete(new ObjectId(id))
                res.status(200).json({ message: 'Video deleted successfully' });
            } else {
                res.status(400).json({ message: 'You are not the owner of this video' });
            }
        } else {
            res.status(400).json({ message: 'Wrong token' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting video' });
    }
});

//http://localhost:4000/getAllMedia/:token
app.get('/getAllMedia/:token', async (req: Request, res: Response) => {
    const token: string = req.params.token;
    try {
        const result: any = await collectionAllMedia.find().toArray();
        //verifie si le media a déjà été like ou pas
        const verifytoken: any = await collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username: string = verifytoken.username;
            for (let i = 0; i < result.length; i++) {
                const result2: any = await collectionMediaLikes.find({ idMedia: result[i]._id, username: username }).toArray();
                if (result2.length > 0) {
                    result[i].isLiked = true;
                }
                else {
                    result[i].isLiked = false;
                }
            }
            res.status(200).send(result);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


// app.get('/getMediaUser/:username', async (req:Request, res:Response) => {
//     try {
//         const result: any = await collectionUsers.find({ username: req.params.username }).toArray();
//         res.status(200).send(result);
//     }
//     catch (err) {
//         res.status(500).send(err);
//     }
// });


//route pour likes/unlike les médias
//http://localhost:4000/likeMedia/:token
//exemple body:
// {
//     "idMedia":"63d2d579f214642039d8ef17",
// }
app.post('/likeMedia/:token', async (req: Request, res: Response) => {
    const token: string = req.params.token;
    const idMedia: string = req.body.idMedia;
    const likes: any = { $inc: { nbLikes: 1 } };
    const dislikes: any = { $inc: { nbLikes: -1 } };
    try {
        const verifytoken: any = await collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username: string = verifytoken.username;
            const alreadyLike: any = await collectionMediaLikes.findOne({ idMedia: new ObjectId(idMedia), username: username });
            if (alreadyLike) {
                //si l'utilisateur a déjà liké la photo, on supprime le like dans les 2 tables
                const result1: any = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(idMedia) }, dislikes);
                if (result1.value) {
                    const result2: any = await collectionMediaLikes.deleteOne({ idMedia: new ObjectId(idMedia), username: username });
                    res.status(200).json({ message: "Unliked !", result1, result2 });
                } else {
                    res.status(400).json({ message: "Erreur unliked!", result1 });
                }
            } else {
                //sinon on ajoute le like dans les 2 tables
                const result1: any = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(idMedia) }, likes);
                if (result1.value) {
                    const result2: any = await collectionMediaLikes.insertOne({ idMedia: new ObjectId(idMedia), username: username });
                    res.status(200).json({ message: "Liked !", result1, result2 });
                } else {
                    res.status(400).json({ message: "Erreur liked!", result1 });
                }
            }
        } else {
            res.status(400).json({ message: "Erreur, token invalide" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


//route pour commenter les médias
//http://localhost:4000/commentsMedia/:token
//exemple body:
// {
//     "idMedia":"63d2d579f214642039d8ef17",
//     "comment": "ta video est nul"
// }
app.post('/commentsMedia/:token', async (req: Request, res: Response) => {
    const token: string = req.params.token;
    const comment: any = req.body.comment;
    const idMedia: string = req.body.idMedia;
    const addComment: any = { $inc: { nbComments: 1 } };
    try {
        const verifytoken: any = await collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username: string = verifytoken.username;
            const result1: any = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(idMedia) }, addComment);
            if (result1.value) {
                const result2: any = await collectionMediaComments.insertOne({ idMedia: new ObjectId(idMedia), username: username, comment: comment });
                res.status(200).json({ message: "Succès!", comment, idMedia, username });
            } else {
                res.status(400).json({ message: "Erreur!", result1 });
            }
        } else {
            res.status(400).json({ message: "Erreur, token invalide" });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});

app.get('/getComments/:idMedia', async (req: Request, res: Response) => {
    const idMedia: string = req.params.idMedia;
    try {
        const result: any = await collectionMediaComments.find({ idMedia: new ObjectId(idMedia) }).toArray();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(401).send(err);
    }
}); 

//route pour supprimer un commentaire
//http://localhost:4000/deleteComments/:token
//exemple body:
// {
//     "idMedia":"63d2d579f214642039d8ef17",
//     "idComment": "63d2d579f214642039d8ef17"
// }
app.post('/deleteComments/:token', async (req: Request, res: Response) => {
    const token: string = req.params.token;
    const idMedia: string = req.body.idMedia;
    const idComment: string = req.body.idComment;
    const deleteComment: any = { $inc: { nbComments: -1 } };
    try {
        const verifytoken: any = await collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username: string = verifytoken.username;
            const result1: any = await collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(idMedia) }, deleteComment);
            if (result1.value) {
                const result2: any = await collectionMediaComments.deleteOne({ _id: new ObjectId(idComment) });
                res.status(200).json({ message: "Succès!", result1, result2 });
            } else {
                res.status(400).json({ message: "Erreur", result1 });
            }
        } else {
            res.status(400).json({ message: "Erreur, token invalide" });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});


//route pour mdp oublié
//http://localhost:4000/forgotpassword
//exemple body:
// {
//     "email": "password@password.com"
// }
//route pour vérifier si le email existe vraiment dans la BD.
app.post("/forgotpassword", async (req: Request, res: Response) => {
    const email: string = req.body.email;

    var mailOptions = {
        from: 'becrazy815@gmail.com',
        to: `${email}`,
        subject: 'Verification code',
        text: `CODE : ${codeGenerator}`,
        html: `${html}`
    }
    try {
        const verifEmailExist: any = await collectionUsers.findOne({ email: email });
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

app.post("/follow/:username/:token", async (req: Request, res: Response) => {
    const username: string = req.params.username;
    const token: string = req.params.token;
    const addFollow: any = { $inc: { nbFollows: 1 } };
    const addFollowing: any = { $inc: { nbFollowers: 1 } };
    try {
        const result = await collectionUsers.findOneAndUpdate({ username: username }, addFollowing);
        if (result.value) {
            res.status(200).json({ message: "Succès!", result });
        } else {
            res.status(400).json({ message: "Erreur", result });
        }

        const result2 = await collectionUsers.findOneAndUpdate({ token: token }, addFollow);
        if (result2.value) {
            res.status(200).json({ message: "Succès!", result2 });
        }
        else {
            res.status(400).json({ message: "Erreur", result2 });
        }
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/unfollow/:username/:token", async (req: Request, res: Response) => {
    const username: string = req.params.username;
    const token: string = req.params.token;
    const removeFollow: any = { $inc: { nbFollows: -1 } };
    const removeFollowing: any = { $inc: { nbFollowers: -1 } };
    try {
        const result = await collectionUsers.findOneAndUpdate({ username: username }, removeFollowing);
        if (result.value) {
            res.status(200).json({ message: "Succès!", result });
        } else {
            res.status(400).json({ message: "Erreur", result });
        }

        const result2 = await collectionUsers.findOneAndUpdate({ token: token }, removeFollow);
        if (result2.value) {
            res.status(200).json({ message: "Succès!", result2 });
        }
        else {
            res.status(400).json({ message: "Erreur", result2 });
        }
    }
    catch (err) {
        console.log(err);
    }
});

//route pour vérifié si le code correspond au code envoyé VIA email.
//http://localhost:4000/verifCode/bastiencambray975@gmail.com
// {
//     "code": "28508",
//     "newpassword": "password"
// }
app.post("/verifCode/:email", async (req: Request, res: Response) => {
    const code: any = req.body.code;
    const newpassword: string = bcrypt.hashSync(req.body.newpassword, saltRounds);
    const email: string = req.params.email;
    if (code == codeGenerator) {
        try {
            const result: any = await collectionUsers.findOneAndUpdate({ email: email }, { $set: { password: newpassword } });
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
// http://localhost:4000/top10media
app.get('/top10media', async (req: Request, res: Response) => {
    const today: Date = new Date();
    const startOfDay: Date = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay: Date = new Date(today.setHours(23, 59, 59, 999));
    try {
        console.log(today);
        const result: any = await collectionAllMedia.find({ created: { $gte: startOfDay, $lte: endOfDay } }).sort({ nbLikes: -1 }).limit(10).toArray();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//route pour rechercher un user par une partie de son username
//http://localhost:4000/searchUser/bas
app.get('/searchUser/:username', async (req: Request, res: Response) => {
    const username: string = req.params.username;
    try {
        //search case insensitive
        const result: any = await collectionUsers.find({ username: { $regex: `^${username}`, $options: 'i' } }).toArray();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

//route pour rechercher les infos du profil d'un utilisateur par son username complet
//http://localhost:4000/userProfil/bastien
app.get('/userProfil/:username', async (req: Request, res: Response) => {
    const username: string = req.params.username;
    try {
        const result: any = await collectionUsers.find({ username: username }).toArray();
        if (result.length > 0) {
            const result2: any = await collectionAllMedia.find({ username: username }).toArray();
            res.status(200).json({ message: "Succès!", result, result2 });
        }
        else {
            res.status(400).json({ message: "Cet utilisateur n'existe pas", result });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
});

app.post('/updateUser/:token', async (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: any = req.body.password;
    const profilePicture: string = req.body.profilePicture;
    const token = req.params.token;
    const bio: string = req.body.bio;

    switch (true) {
        case (!req.body.username && !req.body.password && !req.body.profilePicture):
            const update1: any = { $set: { bio: bio } };
            const result1: any = await collectionUsers.findOneAndUpdate({ token: token }, update1);
            res.status(200).json({ message: "Profil modifié avec succes!", result1 });
            break;
        case (!req.body.username && !req.body.password && !req.body.bio):
            const update2: any = { $set: { profilePicture: profilePicture } };
            const result2: any = await collectionUsers.findOneAndUpdate({ token: token }, update2);
            res.status(200).json({ message: "Profil modifié avec succes!", result2 });
            break;
        case (!req.body.username && !req.body.profilePicture && !req.body.bio):
            const update3: any = { $set: { password: password.bcrypt.hashSync(req.body.password, saltRounds) } };
            const result3: any = await collectionUsers.findOneAndUpdate({ token: token }, update3);
            res.status(200).json({ message: "Profil modifié avec succes!", result3 });
            break;
        case (!req.body.password && !req.body.profilePicture && !req.body.bio):
            const update4: any = { $set: { username: username } };
            const result4: any = await collectionUsers.findOneAndUpdate({ token: token }, update4);
            res.status(200).json({ message: "Profil modifié avec succes!", result4 });
            break;
        case (!req.body.username && !req.body.password):
            const update5: any = { $set: { profilePicture: profilePicture, bio: bio } };
            const result5: any = await collectionUsers.findOneAndUpdate({ token: token }, update5);
            res.status(200).json({ message: "Profil modifié avec succes!", result5 });
            break;
        case (!req.body.username && !req.body.profilePicture):
            const update6: any = { $set: { password: password.bcrypt.hashSync(req.body.password, saltRounds), bio: bio } };
            const result6: any = await collectionUsers.findOneAndUpdate({ token: token }, update6);
            res.status(200).json({ message: "Profil modifié avec succes!", result6 });
            break;
        case (!req.body.username && !req.body.bio):
            const update7: any = { $set: { password: password.bcrypt.hashSync(req.body.password, saltRounds), profilePicture: profilePicture } };
            const result7: any = await collectionUsers.findOneAndUpdate({ token: token }, update7);
            res.status(200).json({ message: "Profil modifié avec succes!", result7 });
            break;
        case (!req.body.password && !req.body.profilePicture):
            const update8: any = { $set: { username: username, bio: bio } };
            const result8: any = await collectionUsers.findOneAndUpdate({ token: token }, update8);
            res.status(200).json({ message: "Profil modifié avec succes!", result8 });
            break;
        case (!req.body.password && !req.body.bio):
            const update9: any = { $set: { username: username, profilePicture: profilePicture } };
            const result9: any = await collectionUsers.findOneAndUpdate({ token: token }, update9);
            res.status(200).json({ message: "Profil modifié avec succes!", result9 });
            break;
        case (!req.body.profilePicture && !req.body.bio):
            const update10: any = { $set: { username: username, password: password.bcrypt.hashSync(req.body.password, saltRounds) } };
            const result10: any = await collectionUsers.findOneAndUpdate({ token: token }, update10);
            res.status(200).json({ message: "Profil modifié avec succes!", result10 });
            break;
        case (!req.body.username):
            const update11: any = { $set: { password: password, profilePicture: profilePicture, bio: bio } };
            const result11: any = await collectionUsers.findOneAndUpdate({ token: token }, update11);
            res.status(200).json({ message: "Profil modifié avec succes!", result11 });
            break;
        case (!req.body.password):
            const update12: any = { $set: { username: username, profilePicture: profilePicture, bio: bio } };
            const result12: any = await collectionUsers.findOneAndUpdate({ token: token }, update12);
            res.status(200).json({ message: "Profil modifié avec succes!", result12 });
            break;
        case (!req.body.profilePicture):
            const update13: any = { $set: { username: username, password: password.bcrypt.hashSync(req.body.password, saltRounds), bio: bio } };
            const result13: any = await collectionUsers.findOneAndUpdate({ token: token }, update13);
            res.status(200).json({ message: "Profil modifié avec succes!", result13 });
            break;
        case (!req.body.bio):
            const update14: any = { $set: { username: username, password: password.bcrypt.hashSync(req.body.password, saltRounds), profilePicture: profilePicture } };
            const result14: any = await collectionUsers.findOneAndUpdate({ token: token }, update14);
            res.status(200).json({ message: "Profil modifié avec succes!", result14 });
            break;
        default:
            const update15: any = { $set: { username: username, password: password.bcrypt.hashSync(req.body.password, saltRounds), profilePicture: profilePicture, bio: bio } };
            const result15: any = await collectionUsers.findOneAndUpdate({ token: token }, update15);
            res.status(200).json({ message: "Profil modifié avec succes!", result15 });
            break;
    }
});
//route pour obtenir le username grâce au token
app.get("/getuser/:token", async (req: Request, res: Response) => {
    const token: string = req.params.token;
    try {
        const getuserinfo: any = await collectionUsers.findOne({ token: token });
        res.status(200).json({ message: "User trouvé!", info: getuserinfo });
    } catch (error) {
        res.status(400).json({ message: "User non trouvé!", error: error });
    }
});

//listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})