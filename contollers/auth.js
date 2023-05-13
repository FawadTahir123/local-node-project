const {createPool} = require('mysql')
const CryptoJS = require("crypto-js");

const pool = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"blood",
    connectionLimit:10
})
module.exports = {
    register: async(req,res) => {
        const user_data = `SELECT * FROM user WHERE email = '${req.body.email}'`;
        pool.query(user_data,(err,result,fields) => {
            if(Object.keys(result).length>0)
            {
                return res.json({status:0,msg:"Email Already exist"});
            }
            else {

                var ciphertext = CryptoJS.AES.encrypt(req.body.password, 'jkhkefheuf398rubjkvebkeejvn').toString();

                const sql = `INSERT INTO user 
                (first_name,last_name,cnic,phone_no,age,blood_group,email,password,user_role,account_status,address,gender,availability) 
                VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.cnic}','${req.body.phoneNo}','${req.body.age}',
                '${req.body.blood}','${req.body.email}','${ciphertext}','${req.body.user_role}','${req.body.account_status}','${req.body.address}',
                '${req.body.gender}','${req.body.availability}')`;
                pool.query(sql,(err,result,fields) => {
                    if(err)
                    {
                        return res.json({status:1,msg:err})
                    }
                    else {
                        return res.json({status:2,msg:'User registered successfully!!'})
                    }
                })
            }
        })
    },
    login: async(req,res) => {

        const user_data = `SELECT * FROM user WHERE email = '${req.body.email}'`;
        pool.query(user_data,(err,result,fields) => {
            if(Object.keys(result).length === 0)
            {
                return res.json({status:0,msg:"Email Not Found"});
            }
            else {
                const ciphertext = result[0].password;
                var bytes  = CryptoJS.AES.decrypt(ciphertext, 'jkhkefheuf398rubjkvebkeejvn');
                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                if(originalText===req.body.password)
                {
                    return res.json({status:2,msg:"User authenticate successfully!!",data:result});
                }
                else {
                    return res.json({status:1,msg:"Password not correct"});
                }
            }
        })
    },
}