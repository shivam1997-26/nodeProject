const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const aepsSchema = new Schema({
    Txntype: {
        type: String
    },
    Timestamp: {
        type: String
    },
    BcId: {
        type: String

    },
    TerminalId: {
        type: String
    },
    TransactionId: {
        type: String
    },
    Amount: {
        type: String
    },
    TxnStatus: {
        type: String
    },
    BankIIN: {
        type: String
    },
    TxnMedium: {
        type: String
    },
    EndCustMobile: {
        type: String
    },
    rrn:{
        type: String
    },
    bankmessage:{
        type:String
    }

});

module.exports = mongoose.model('AepsReport', aepsSchema);


