import express, { Request, response, Response } from 'express';
import MulterRequest from './models/MulterRequest';
const { MongoClient, ServerApiVersion, GridFSBucket, Db } = require('mongodb');

//require setup
var bodyParser = require('body-parser');
var fs = require('fs');
var bcrypt = require('bcrypt');
var axios = require('axios');
var multer = require('multer');
const upload = multer({ dest: "uploads/" });

//express setup
var app = express();
const saltRounds = 10;
var port = 3000;

//app.use
app.use(bodyParser.json());

//MONGO DB SETUP
const uri = "mongodb+srv://momo:Oran2023@projetbecrazy.h0ghj.mongodb.net/?retryWrites=true&w=majority";

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
app.post('/signup', (req:Request, res:Response) => {
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
    .then(function (response:any) {
        console.log(JSON.stringify(response.data));
        res.send(response.data);
    })
    .catch(function (error:any) {
        console.log(error);
        res.send(error);
    });
}
);

app.get("/aiChallenge", (req:Request, res:Response) =>{
    getCompletion().then((response:any) => {
        console.log(response);
        res.send(response);
    }
    ).catch((error:any) => {
        console.log(error);
    }
    );
});

let dbClient:typeof MongoClient;
app.post('/postMedia', upload.single("video"), (req:Request, res:Response) => {
  MongoClient.connect(uri, (err:Error, client:typeof MongoClient) => {
    if(err) {
      console.log(err);
      res.status(500).json({ message: 'Error connecting to MongoDB' });
      return;
    }
    dbClient = client;
    const collection = client.db("BeCrazy").collection("users");
    const bucket = new GridFSBucket(client.db("BeCrazy"), { bucketName: 'videos' });
    const videoStream = fs.createReadStream((req as unknown as MulterRequest).file.path);
    const uploadStream = bucket.openUploadStream((req as unknown as MulterRequest).file.originalname);

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
        const downloadStream = bucket.openDownloadStream(req.params.id);
        downloadStream.pipe(res); 
        dbClient.close(); // close the connection once the operation is finished
    });
});


//listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
);