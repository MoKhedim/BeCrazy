import express, { Request, response, Response } from 'express';
const { Configuration, OpenAIApi } = require("openai");


var bodyParser = require('body-parser');
var app = express();
var port = 3000;
var bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(bodyParser.json());

var axios = require('axios');

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

//route with ts type
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

app.get('/login', (req:Request, res:Response) => {
    const body = JSON.stringify(req.body);
    console.log(body);
    var data = JSON.stringify({
        "collection": "users",
        "database": "BeCrazy",
        "dataSource": "ProjetBeCrazy",
        "filter": {
            "email": req.body.email,
            "password": req.body.password
        }
    });
    var config = {
        method: 'post',
        url: 'https://data.mongodb-api.com/app/data-diwam/endpoint/data/v1/action/find',
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


//listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}
);