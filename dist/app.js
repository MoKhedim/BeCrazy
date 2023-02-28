"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { MongoClient, ServerApiVersion, ObjectId, GridFSBucket, Db } = require('mongodb');
const index_1 = require("./forgetpassword/index");
const dotenv = __importStar(require("dotenv"));
//require setup\\
dotenv.config(); //load .env file
var bodyParser = require('body-parser');
var fs = require('fs');
var bcrypt = require('bcrypt');
var multer = require('multer');
const upload = multer({ dest: "uploads/" });
//express setup
var app = (0, express_1.default)();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const ffmpeg = require('fluent-ffmpeg');
const secret = "dgjkgevuyetggvdghdfhegchgjdg,dvbmdghkdvghmdvhmshmg"; //express setup
const saltRounds = 10;
const port = process.env.PORT || 4000;
//app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors());
const uri = "mongodb+srv://Bastien:Bastien975@projetbecrazy.h0ghj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }, (err, client) => {
    if (err) {
        console.log(err);
        return;
    }
});
const db = client.db('BeCrazy');
const collectionAllMedia = db.collection('allMedia');
const collectionMediaLikes = db.collection('mediaLikes');
const collectionMediaComments = db.collection('mediaComments');
const collectionUsers = db.collection('users');
//openai setup
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
function getCompletion() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield openai.createCompletion({
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
    });
}
//route pour sign up
//http://localhost:4000/signup
//exemple body :
// {
//     "username":"password2",
//     "email": "password2@password.com",
//     "password": "password2"
// }
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds),
        bio: "this is a bio",
        profilePicture: "",
        created: today,
        token: "",
        nbFollows: 0,
        nbFollowers: 0
    };
    const profilepicDefault = "data:image/jpeg;base64,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D//aAAwDAQACAAMAAAAQ8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888w8888888888888888888888888888888888888888888888888888888888888888888884UwAI48888888888888888888888g88888sw888888888888888888884c8888888o8888888888888888888g8888888848888888888888888884Y888888888U888888888888888888U8888848888888888888888888888U8884M8Y88c88888888888888888sU884c88808c88888888888888888sU80c8888s0c888888888888888888c4c888888cI888888888888888888ko884w884M88888888888888888888MM0IIwUs888888888888888888888888888888888888888w88888888888w88U0s888888888888888888888EYIAAAAc8k888888888888888888w888sMM888800888888888888888gU88888888888I888888888888880AQ888888888888Y888888M888884kAAU88888888884Qc888888888884oAAQ8888888888gAM88888888888IoAAAU88888888gAA0c888888888o0oAAAQ8888888gAAAos8888w8888gcgAAAA8888888AAAAg8g8888//EABQRAQAAAAAAAAAAAAAAAAAAAJD/2gAIAQMBAT8QUn//xAAUEQEAAAAAAAAAAAAAAAAAAACQ/9oACAECAQE/EFJ//8QALBABAAEDAQYHAQEAAwEAAAAAAREAITFBQFBRYXGBECAwkaGxwfDRcIDh8f/aAAgBAQABPxD/ALj3/wCewdaFEhTCTWSLU2ksTRfnHCoqMtInzKvYqDhwpbHPg+/1TILcQntdRJjzq/jipLzRRonSgdd3WWvZ454zjWacB45LO6kSXR7VeC1lBjsT28nXxGDFpD6WpA0t4BGbpwo0EZpCPG1dqXLhb/N2POowp3Mjl+fnicVPkk4UvAn3W/x5ZqfKl7ZiGU6/0lEPl3BJcBuacpbnAJLjuqeiRlzAf59G9qsXPJLGC3Ijp6ooIiXOVTpXDyQi+/ba5fMtO553irW0oJ0f+CmSsKaRY5QNvd9drRy0IHIl5HFAEB6uRHq+bcKcgXjG5soYvRh62VownyM5dhMSp2KXZS+sx7UV40bmDDcWk7b7/FPtG6VEq85zsJP3UiS8ZZly7PRG5hDNzExJlxx2LKnz4WM29lkq5bk4VPw3dofRNldNiYkATQf+0IxCMzGh1zU4Y6biKEEsN/ppSNSUyvOovsRUhi6HrB2rDu3CaTTFJa9RF3T/ADYymWth9ZG4nCrbNIpf62Z7049WePmKWfs6/wAuLuPWoLT4UH+049OfE8pmjG4X7p/NyfyNcpx6LnzHkKl2YXuzcn9ngpx6D6n87jrM6bjXnXvWpx559VYmhz0/astw8KhhyrBl891q7GVdX7aH6dxGk0xSG8W+2WSK/wAfmxFGDrUYUdPj277khi4MQuVMriqIMPtCUeN8etr4AEEqhLIF53FIsSbksvoj0Rl0i3UijYTXpTii886hbvrrF6uDhUtgNc7kaNZzszJqR71KYXoRFA8C1zI28J9c4I7ypEAar9tMEsEDJjifYuCxuXOKhYt76B0S7PvmGlLBrdYk6mlrPEq3mioqPM+mIny8g6e1FGg0iFsnNOeC3XdEUrkGUM626a1YZ5YqXxDf751HWTBLTgF1ubVsePau1RUeM0+Kii2DWCtTUMAzyT1elYzhRYL0A9t1S60KIGgYjtQCV7cUX1ml2deR/E0M8fEv+/lZpuZftOAquJU37on6qnxZcV+VqG5rD7hfmo4Cbo89MfFAZ/QJTfS2f+CZ2exr+VJrT4Q0cmuz3qHyBru5z2pjrUhcA3zmKkqMkv8AY44/5ypeSzSH/HMrrgf/ACZr5AP96GWH98afVOf/AGbUrAcuj3D7FPzp5VO8L7UwDi0wl63/AAUmNGGOHWK7O6RLC/tcrXb6GHjpHCbVJrcrE5tls2b0sBgTFBglv8+g+LEIIWRznM1/AsAb/cUkkM397PvD1pSAHIokL+7mJosF6gNLksRxpOkEfoEY5DjxpGRRVVzRXLnR52pp8gd+JbceLLpaczQDHyBVz2pyehUbjJ0qzDKiXhj5tBzLJSe5lpWf0eaaPI+gDUDIloqeowkLF7hpiYverYfAy6kWv77hkqgKDuVKOMTI7pr8ryuNa+jNT6WKKutiwb3WvtCVHGCS1kNvQyS2vi+3yMDRbiU/+TMRCl/oOi6A7QnZA7QfsP3NWYCPYV+vDfTUttsBNhE5ptRzkjWxxOnO5o0bTenZBvUJFwwDjnJUEIARjlpz12uyCaRSGaKkMdLl2ccZk2spJ/DFWmgveDPK5rItyuOPqy4Hp30q6kRexTc9W2Y6a02I2WZVXiy+R2g8EiaGRvhjhoOkG0Nre1QBtOdaSMpwm/VAekHmdnPCDKk2AZHklnlSIMi4ZMdZpzs9mYHlsfFY5tDpUeV2fr4kbGQNJ9GNJKc7PKu56MJ6kzHKBrh53adTrvQkjGt6e1JfzMyjZkCLOieK7TNZb67aeVEBXaiLqfJ77NpA4TVM9H0XaNLcaVBQiJnS9rofLZZ+F0vAi8ri0+DuBkggji40c5AmdLse2xuKIItvipnEqle3pu0GKFhlPzGGunY0SQT7MnK006dPF9B9c9EqYTALMqv0qEB19GfR41/K40dOni+i+qei0Y9Iw58P/9k=";
    try {
        const verifEmail = yield collectionUsers.findOne({ email: user.email });
        if (verifEmail) {
            res.status(100).send("email already exist");
        }
        else {
            const verifUsername = yield collectionUsers.findOne({ username: user.username });
            if (verifUsername) {
                res.status(100).send("username already exist");
            }
            else {
                const result = yield collectionUsers.insertOne({ username: user.username, email: user.email, password: user.password, bio: user.bio, profilePicture: profilepicDefault, created: user.created, token: user.token, nbFollows: user.nbFollows, nbFollowers: user.nbFollowers });
                if (result) {
                    res.status(200).send("user created");
                }
                else {
                    res.status(500).send("user not created");
                }
            }
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
//route pour se connecter
//http://localhost:4000/login
//exemple body :
// {
//     "email": "password@password.com",
//     "password": "password"
// }
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        username: "",
        email: req.body.email,
        password: req.body.password,
        bio: "",
        profilePicture: "",
        created: new Date,
        token: "",
        nbFollows: 0,
        nbFollowers: 0
    };
    try {
        const findUser = yield collectionUsers.findOne({ email: user.email });
        if (findUser) {
            const match = yield bcrypt.compare(user.password, findUser.password);
            if (match) {
                const payload = { id: findUser._id };
                const token = jwt.sign(payload, secret, { expiresIn: "1h" });
                const updatetoken = yield collectionUsers.findOneAndUpdate({ email: user.email }, { $set: { token: token } });
                if (updatetoken) {
                    res.status(200).send({ message: "Successfully logged in", token: token });
                }
            }
            else {
                res.status(400).send("wrong password");
            }
        }
        else {
            res.status(400).send("wrong email");
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
app.post("/aiChallenge", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    getCompletion().then((result) => {
        res.status(200).send(result);
    });
}));
//http://localhost:4000/postMedia/:token
// form-data key :
// video: Select File
// description: description
app.post('/postMedia/:token', upload.single("video"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const description = req.body.description;
    const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
    const videoStream = fs.createReadStream(req.file.path);
    const uploadStream = bucket.openUploadStream(req.file.originalname);
    try {
        const verifytoken = yield collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username = verifytoken.username;
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
                .on('error', (error) => {
                console.log(error);
                res.status(500).json({ message: 'Error uploading video' });
            })
                .on('finish', (file) => {
                fs.unlinkSync(req.file.path);
                res.status(200).json({ message: 'Video uploaded successfully' });
                res.send(file.id);
            });
        }
        else {
            res.status(400).json({ message: 'Wrong token' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error uploading video' });
    }
}));
app.get('/getMedia/:id', (req, res) => {
    const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
    const downloadStream = bucket.openDownloadStream(new ObjectId(req.params.id));
    downloadStream.pipe(res);
    //send the video to the upload folder
    downloadStream.on('error', (error) => {
        console.log(error);
        res.status(500).json({ message: 'Error downloading video' });
    });
    downloadStream.on('finish', () => {
        const video = ffmpeg('uploads/' + req.file.originalname);
        video.toFormat('mp4').save('uploads/' + req.file.originalname + '.mp4');
        const upload = multer({ dest: 'uploads/' });
        res.status(200).json({ message: 'Video downloaded successfully' });
    });
});
//http://localhost:4000/deleteMedia/:id/:token
app.delete('/deleteMedia/:id/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const id = req.params.id;
    try {
        const verifytoken = yield collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username = verifytoken.username;
            const verifyMediaUser = yield collectionAllMedia.findOne({ videoId: new ObjectId(id), username: username });
            if (verifyMediaUser) {
                const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
                yield collectionAllMedia.deleteOne({ videoId: new ObjectId(id) });
                yield bucket.delete(new ObjectId(id));
                res.status(200).json({ message: 'Video deleted successfully' });
            }
            else {
                res.status(400).json({ message: 'You are not the owner of this video' });
            }
        }
        else {
            res.status(400).json({ message: 'Wrong token' });
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting video' });
    }
}));
//http://localhost:4000/getAllMedia/:token
app.get('/getAllMedia/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        const result = yield collectionAllMedia.find().toArray();
        //verifie si le media a déjà été like ou pas
        const verifytoken = yield collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username = verifytoken.username;
            for (let i = 0; i < result.length; i++) {
                const result2 = yield collectionMediaLikes.find({ idMedia: result[i]._id, username: username }).toArray();
                if (result2.length > 0) {
                    result[i].isLiked = true;
                }
                else {
                    result[i].isLiked = false;
                }
            }
            res.status(200).send(result);
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
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
app.post('/likeMedia/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const idMedia = req.body.idMedia;
    const likes = { $inc: { nbLikes: 1 } };
    const dislikes = { $inc: { nbLikes: -1 } };
    try {
        const verifytoken = yield collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username = verifytoken.username;
            const alreadyLike = yield collectionMediaLikes.findOne({ idMedia: new ObjectId(idMedia), username: username });
            if (alreadyLike) {
                //si l'utilisateur a déjà liké la photo, on supprime le like dans les 2 tables
                const result1 = yield collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(idMedia) }, dislikes);
                if (result1.value) {
                    const result2 = yield collectionMediaLikes.deleteOne({ idMedia: new ObjectId(idMedia), username: username });
                    res.status(200).json({ message: "Unliked !", result1, result2 });
                }
                else {
                    res.status(400).json({ message: "Erreur unliked!", result1 });
                }
            }
            else {
                //sinon on ajoute le like dans les 2 tables
                const result1 = yield collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(idMedia) }, likes);
                if (result1.value) {
                    const result2 = yield collectionMediaLikes.insertOne({ idMedia: new ObjectId(idMedia), username: username });
                    res.status(200).json({ message: "Liked !", result1, result2 });
                }
                else {
                    res.status(400).json({ message: "Erreur liked!", result1 });
                }
            }
        }
        else {
            res.status(400).json({ message: "Erreur, token invalide" });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
//route pour commenter les médias
//http://localhost:4000/commentsMedia/:token
//exemple body:
// {
//     "idMedia":"63d2d579f214642039d8ef17",
//     "comment": "ta video est nul"
// }
app.post('/commentsMedia/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const comment = req.body.comment;
    const idMedia = req.body.idMedia;
    const addComment = { $inc: { nbComments: 1 } };
    try {
        const verifytoken = yield collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username = verifytoken.username;
            const result1 = yield collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(idMedia) }, addComment);
            if (result1.value) {
                const result2 = yield collectionMediaComments.insertOne({ idMedia: new ObjectId(idMedia), username: username, comment: comment });
                res.status(200).json({ message: "Succès!", comment, idMedia, username });
            }
            else {
                res.status(400).json({ message: "Erreur!", result1 });
            }
        }
        else {
            res.status(400).json({ message: "Erreur, token invalide" });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
app.get('/getComments/:idMedia', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idMedia = req.params.idMedia;
    try {
        const result = yield collectionMediaComments.find({ idMedia: new ObjectId(idMedia) }).toArray();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(401).send(err);
    }
}));
//route pour supprimer un commentaire
//http://localhost:4000/deleteComments/:token
//exemple body:
// {
//     "idMedia":"63d2d579f214642039d8ef17",
//     "idComment": "63d2d579f214642039d8ef17"
// }
app.post('/deleteComments/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const idMedia = req.body.idMedia;
    const idComment = req.body.idComment;
    const deleteComment = { $inc: { nbComments: -1 } };
    try {
        const verifytoken = yield collectionUsers.findOne({ token: token });
        if (verifytoken) {
            const username = verifytoken.username;
            const result1 = yield collectionAllMedia.findOneAndUpdate({ _id: new ObjectId(idMedia) }, deleteComment);
            if (result1.value) {
                const result2 = yield collectionMediaComments.deleteOne({ _id: new ObjectId(idComment) });
                res.status(200).json({ message: "Succès!", result1, result2 });
            }
            else {
                res.status(400).json({ message: "Erreur", result1 });
            }
        }
        else {
            res.status(400).json({ message: "Erreur, token invalide" });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
//route pour mdp oublié
//http://localhost:4000/forgotpassword
//exemple body:
// {
//     "email": "password@password.com"
// }
//route pour vérifier si le email existe vraiment dans la BD.
app.post("/forgotpassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    var mailOptions = {
        from: 'becrazy815@gmail.com',
        to: `${email}`,
        subject: 'Verification code',
        text: `CODE : ${index_1.codeGenerator}`,
        html: `${index_1.html}`
    };
    try {
        const verifEmailExist = yield collectionUsers.findOne({ email: email });
        if (verifEmailExist) {
            index_1.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.status(200).json({ message: "Email envoyé avec succes!" });
        }
        else {
            res.status(400).json({ message: "Email non existant." });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
//route pour vérifié si le code correspond au code envoyé VIA email.
//http://localhost:4000/verifCode/bastiencambray975@gmail.com
// {
//     "code": "28508",
//     "newpassword": "password"
// }
app.post("/verifCode/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    const newpassword = bcrypt.hashSync(req.body.newpassword, saltRounds);
    const email = req.params.email;
    if (code == index_1.codeGenerator) {
        try {
            const result = yield collectionUsers.findOneAndUpdate({ email: email }, { $set: { password: newpassword } });
            if (result.value) {
                res.status(200).json({ message: "Mot de passe modifié avec succes!", result });
            }
            else {
                res.status(400).json({ message: "Erreur lors de la modification du mot de passe.", result });
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    else {
        res.status(400).json({ message: "Code incorrect." });
    }
}));
//route pour obtenir le top 10 des médias ayant eu le plus de like dans la journée en cours.
// http://localhost:4000/top10media
app.get('/top10media', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    try {
        console.log(today);
        const result = yield collectionAllMedia.find({ created: { $gte: startOfDay, $lte: endOfDay } }).sort({ nbLikes: -1 }).limit(10).toArray();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
//route pour rechercher un user par une partie de son username
//http://localhost:4000/searchUser/bas
app.get('/searchUser/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    try {
        //search case insensitive
        const result = yield collectionUsers.find({ username: { $regex: `^${username}`, $options: 'i' } }).toArray();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
//route pour rechercher les infos du profil d'un utilisateur par son username complet
//http://localhost:4000/userProfil/bastien
app.get('/userProfil/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    try {
        const result = yield collectionUsers.find({ username: username }).toArray();
        if (result.length > 0) {
            const result2 = yield collectionAllMedia.find({ username: username }).toArray();
            res.status(200).json({ message: "Succès!", result, result2 });
        }
        else {
            res.status(400).json({ message: "Cet utilisateur n'existe pas", result });
        }
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
app.post('/updateUser/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const profilePicture = req.body.profilePicture;
    const token = req.params.token;
    const bio = req.body.bio;
    switch (true) {
        case (!req.body.username && !req.body.password && !req.body.profilePicture):
            const update1 = { $set: { bio: bio } };
            const result1 = yield collectionUsers.findOneAndUpdate({ token: token }, update1);
            res.status(200).json({ message: "Profil modifié avec succes!", result1 });
            break;
        case (!req.body.username && !req.body.password && !req.body.bio):
            const update2 = { $set: { profilePicture: profilePicture } };
            const result2 = yield collectionUsers.findOneAndUpdate({ token: token }, update2);
            res.status(200).json({ message: "Profil modifié avec succes!", result2 });
            break;
        case (!req.body.username && !req.body.profilePicture && !req.body.bio):
            const update3 = { $set: { password: password.bcrypt.hashSync(req.body.password, saltRounds) } };
            const result3 = yield collectionUsers.findOneAndUpdate({ token: token }, update3);
            res.status(200).json({ message: "Profil modifié avec succes!", result3 });
            break;
        case (!req.body.password && !req.body.profilePicture && !req.body.bio):
            const update4 = { $set: { username: username } };
            const result4 = yield collectionUsers.findOneAndUpdate({ token: token }, update4);
            res.status(200).json({ message: "Profil modifié avec succes!", result4 });
            break;
        case (!req.body.username && !req.body.password):
            const update5 = { $set: { profilePicture: profilePicture, bio: bio } };
            const result5 = yield collectionUsers.findOneAndUpdate({ token: token }, update5);
            res.status(200).json({ message: "Profil modifié avec succes!", result5 });
            break;
        case (!req.body.username && !req.body.profilePicture):
            const update6 = { $set: { password: password.bcrypt.hashSync(req.body.password, saltRounds), bio: bio } };
            const result6 = yield collectionUsers.findOneAndUpdate({ token: token }, update6);
            res.status(200).json({ message: "Profil modifié avec succes!", result6 });
            break;
        case (!req.body.username && !req.body.bio):
            const update7 = { $set: { password: password.bcrypt.hashSync(req.body.password, saltRounds), profilePicture: profilePicture } };
            const result7 = yield collectionUsers.findOneAndUpdate({ token: token }, update7);
            res.status(200).json({ message: "Profil modifié avec succes!", result7 });
            break;
        case (!req.body.password && !req.body.profilePicture):
            const update8 = { $set: { username: username, bio: bio } };
            const result8 = yield collectionUsers.findOneAndUpdate({ token: token }, update8);
            res.status(200).json({ message: "Profil modifié avec succes!", result8 });
            break;
        case (!req.body.password && !req.body.bio):
            const update9 = { $set: { username: username, profilePicture: profilePicture } };
            const result9 = yield collectionUsers.findOneAndUpdate({ token: token }, update9);
            res.status(200).json({ message: "Profil modifié avec succes!", result9 });
            break;
        case (!req.body.profilePicture && !req.body.bio):
            const update10 = { $set: { username: username, password: password.bcrypt.hashSync(req.body.password, saltRounds) } };
            const result10 = yield collectionUsers.findOneAndUpdate({ token: token }, update10);
            res.status(200).json({ message: "Profil modifié avec succes!", result10 });
            break;
        case (!req.body.username):
            const update11 = { $set: { password: password, profilePicture: profilePicture, bio: bio } };
            const result11 = yield collectionUsers.findOneAndUpdate({ token: token }, update11);
            res.status(200).json({ message: "Profil modifié avec succes!", result11 });
            break;
        case (!req.body.password):
            const update12 = { $set: { username: username, profilePicture: profilePicture, bio: bio } };
            const result12 = yield collectionUsers.findOneAndUpdate({ token: token }, update12);
            res.status(200).json({ message: "Profil modifié avec succes!", result12 });
            break;
        case (!req.body.profilePicture):
            const update13 = { $set: { username: username, password: password.bcrypt.hashSync(req.body.password, saltRounds), bio: bio } };
            const result13 = yield collectionUsers.findOneAndUpdate({ token: token }, update13);
            res.status(200).json({ message: "Profil modifié avec succes!", result13 });
            break;
        case (!req.body.bio):
            const update14 = { $set: { username: username, password: password.bcrypt.hashSync(req.body.password, saltRounds), profilePicture: profilePicture } };
            const result14 = yield collectionUsers.findOneAndUpdate({ token: token }, update14);
            res.status(200).json({ message: "Profil modifié avec succes!", result14 });
            break;
        default:
            const update15 = { $set: { username: username, password: password.bcrypt.hashSync(req.body.password, saltRounds), profilePicture: profilePicture, bio: bio } };
            const result15 = yield collectionUsers.findOneAndUpdate({ token: token }, update15);
            res.status(200).json({ message: "Profil modifié avec succes!", result15 });
            break;
    }
}));
//route pour obtenir le username grâce au token
app.get("/getuser/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    try {
        const getuserinfo = yield collectionUsers.findOne({ token: token });
        res.status(200).json({ message: "User trouvé!", info: getuserinfo });
    }
    catch (error) {
        res.status(400).json({ message: "User non trouvé!", error: error });
    }
}));
//listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
