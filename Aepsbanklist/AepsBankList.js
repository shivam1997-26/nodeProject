const axios = require('axios');
const express = require('express');


 export const Aepsbank = async () => {
    try {
        const res = await axios({
            method: 'get',
            url: 'http://uat.dhansewa.com/Common/Aepsbanklist',
            headers: {}
        });
        return res.data;
    }
    catch (error) {
        console.log(error)
    }
}


// const insertaepsbank=() => {

//     var data = '';

//     var config = {
//         method: 'get',
//         url: 'http://uat.dhansewa.com/Common/Aepsbanklist',
//         headers: {},
//         data: data
//     };

//     axios(config)
//         .then(function (response) {
//             console.log(JSON.stringify(response.data));
//             dbconn().then((data)=>{
//                 data.collection('AepsbankList').insert(response.data,(err,resp)=>{
//                     if (err) throw err;
//                     console.log(resp);
//                 })
//             }).catch((error)=>{
//                 console.log(error)
//             })
//         })
//         .catch(function (error) {
//             console.log(error);
//         });

// }