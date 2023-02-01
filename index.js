const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')

const app = express()

dotenv.config()


app.get('/', (req,res) => {
     res.send('hi shivam')
})

app.get('/aepsInitate',(req,res)=>{
    var data = JSON.stringify({
        "bc_id": "BC0929091",
        "phone1": "8169167617",
        "ip": "104.98.216.00",
        "userid": "AM003304",
        "saltkey": process.env.saltkey,
        "secretkey": process.env.secretkey
    });

    var config = {
        method: 'post',
        url: process.env.url,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));

        

            res.redirect('https://icici.bankmitra.org/Location.aspx?text='+response.data[0].Result);

            // res.writeHead(301, {
            //     Location: `https://icici.bankmitra.org/Location.aspx?text="${response.data[0].Result}"`
            //   }).end();

            

        })
        .catch(function (error) {
            console.log(error);
        });
})


app.get('/aepsfirstcallback',(req,res)=>{
     console.log(req.query)
     res.status(200).send('OK')
})

app.get('/shiva', (req,res) => res.redirect('http://www.v2.egram.org/'))

app.listen(1100)