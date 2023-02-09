const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
// const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const AepsReport = require('./model/aeps');
const { dbconn } = require('./db/Database');


const app = express()

dotenv.config()

// mongoose.set('strictQuery', false);
// mongoose.connect(process.env.mongourl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log('Connected!'));


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

            res.redirect('https://icici.bankmitra.org/Location.aspx?text=' + response.data[0].Result);

        })

        .catch(function (error) {

            console.log(error);

        });
})


// app.get('/aepsfirstcallback', async (req, res) => {

//     const { Txntype, Timestamp, BcId, TerminalId, TransactionId, Amount, TxnStatus, BankIIN, TxnMedium, EndCustMobile } = req.query;
//     const aepsdata = new AepsReport({
//         Txntype,
//         Timestamp,
//         BcId,
//         TerminalId,
//         TransactionId,
//         Amount,
//         TxnStatus,
//         BankIIN,
//         TxnMedium,
//         EndCustMobile,
//     });

//     try {

//         await aepsdata.save(aepsdata);

//         res.status(200).send({
//             MESSAGE: "Success",
//             STATUS: "SUCCESS",
//             TRANSACTION_ID: TransactionId,
//             VENDOR_ID: TransactionId
//         })


//     } catch (err) {
//         console.log(err);
//     }


// })


app.get('/aepsfirstcallback', async (req, res) => {

    const { Txntype, Timestamp, BcId, TerminalId, TransactionId, Amount, TxnStatus, BankIIN, TxnMedium, EndCustMobile } = req.query;

    const data = await dbconn()

    const bankdata = data.collection('AepsbankList').find({ IIN: BankIIN })

    const bankdata1 = await bankdata.toArray()

    const aepsdata = {
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
        bankname: bankdata1[0].NAME
    };

    try {

        dbconn().then((data) => {
            data.collection("aepsreports").insertOne(aepsdata, function (err, resp) {
                console.log(resp)
                if (err) throw err;
                res.status(200).send({
                    MESSAGE: "Success",
                    STATUS: "SUCCESS",
                    TRANSACTION_ID: TransactionId,
                    VENDOR_ID: TransactionId
                })

            });

        }).catch(err => {
            console.log(err)
        })
    } catch (err) {
        console.log(err);
    }
})

// app.get('/aepsSecondcallback', async (req, res) => {

//     const { TransactionId, VenderId, Status, BcCode, rrn, bankmessage } = req.query

//     let aepsalldata;
//     try {
//         aepsalldata = await AepsReport.updateOne({ TransactionId: TransactionId }, { $set: { TxnStatus: Status, rrn: rrn, bankmessage: bankmessage } });
//         if (aepsalldata.acknowledged === true && aepsalldata.matchedCount === 1 && aepsalldata.modifiedCount === 1) {


//             res.status(200).send(
//                 {
//                     "MESSAGE": "update Successfully!!",
//                     "STATUS": "SUCCESS"
//                 }
//             )
//         }
//         else {
//             res.status(202).send(
//                 {
//                     "MESSAGE": "there is some issue!!",
//                     "STATUS": "FAILED"
//                 }
//             )
//         }

//     }
//     catch (err) {
//         res.status(500).send(err);
//     }

// })

app.get('/aepsSecondcallback', async (req, res) => {

    const { TransactionId, VenderId, Status, BcCode, rrn, bankmessage } = req.query


    try {

        dbconn().then((data) => {
            data.collection("aepsreports").updateOne({ TransactionId: TransactionId }, { $set: { TxnStatus: Status, rrn: rrn, bankmessage: bankmessage } }, (err, resp) => {

                if (err) throw err;

                console.log(resp)

                if (resp.acknowledged === true && resp.matchedCount === 1 && resp.modifiedCount === 1) {

                    res.status(200).send(
                        {
                            "MESSAGE": "update Successfully!!",
                            "STATUS": "SUCCESS"
                        }
                    )
                }
                else {
                    res.status(202).send(
                        {
                            "MESSAGE": "there is some issue!!",
                            "STATUS": "FAILED"
                        }
                    )
                }

            });

        }).catch(err => {
            console.log(err)
        })
    }

    catch (err) {
        res.status(500).send(err);
    }

})

app.get('/db', (req, res) => {
    // dbconn().then((data) => {
    //     data.collection("aepsreports").find({}).toArray((err, result) => {
    //         if (err) throw err;
    //         console.log(result);
    //         res.send(result)
    //     });

    // }).catch(err => {
    //     console.log(err)
    // })
        var data = '';

    var config = {
        method: 'get',
        url: 'http://uat.dhansewa.com/Common/Aepsbanklist',
        headers: {},
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            dbconn().then((data)=>{
                data.collection('AepsbankList').insert(response.data,(err,resp)=>{
                    if (err) throw err;
                    console.log(resp);
                })
            }).catch((error)=>{
                console.log(error)
            })
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.listen(1200)