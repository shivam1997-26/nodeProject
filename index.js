const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const mongoose = require('mongoose');

const AepsReport = require('./model/aeps')

const app = express()

dotenv.config()


mongoose.set("strictQuery", false);

mongoose.connect(process.env.mongourl)
  .then(() => console.log('Connected!'));


app.get('/', (req, res) => {
    res.send('hi shivam')
})

app.get('/aepsInitate', (req, res) => {
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



            res.redirect('https://icici.bankmitra.org/Location.aspx?text=' + response.data[0].Result);

            // res.writeHead(301, {
            //     Location: `https://icici.bankmitra.org/Location.aspx?text="${response.data[0].Result}"`
            //   }).end();



        })
        .catch(function (error) {
            console.log(error);
        });
})


app.get('/aepsfirstcallback',async(req, res) => {

    console.log(req.query)

    const { Txntype, Timestamp, BcId, TerminalId, TransactionId, Amount, TxnStatus, BankIIN, TxnMedium,EndCustMobile } = req.query;

    const aepsdata = new AepsReport({
        Txntype,
        Timestamp,
        BcId,
        TerminalId,
        TransactionId,
        Amount,
        TxnStatus,
        BankIIN,
        TxnMedium,
        EndCustMobile,
    });

    try {

        await aepsdata.save(aepsdata);

        res.status(200).send({
            MESSAGE: "Success",
            STATUS: "SUCCESS",
            TRANSACTION_ID:TransactionId,
            VENDOR_ID:TransactionId
        })
    

    } catch (err) {
        console.log(err);
    }

    
})



app.listen(1100)