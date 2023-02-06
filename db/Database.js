const MongoClient = require('mongodb').MongoClient
const dotenv = require('dotenv')

dotenv.config()

const url = process.env.mongourl

const dbconn = async (req) => {
    const connect = await MongoClient.connect(url)
    try {

        const conn = connect.db()
        return conn;
    }
    catch (error) {
        console.log(error);
    };
}

exports.dbconn = dbconn;




