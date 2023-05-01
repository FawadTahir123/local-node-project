const { createPool } = require('mysql')

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "blood",
    connectionLimit: 10
})
module.exports = {
    cardsData: async (req, res) => {

        var total_patient = 0;
        var total_donor = 0;
        var total_request = 0;
        var total_events = 0;


        const sql = `SELECT count(*) as patient_count from user WHERE user_role = '2'`;
        pool.query(sql, (err, result, field) => {
            total_patient = result[0].patient_count

            const sql2 = `SELECT count(*) as donor_count from user WHERE user_role = '3'`;
            pool.query(sql2, (err, result, field) => {
                total_donor = result[0].donor_count
            })

            const sql3 = `SELECT count(*) as total_request FROM requests`;
            pool.query(sql3, (err, result, field) => {
                total_request = result[0].total_request
            })

            const sql4 = `SELECT count(*) as total_events FROM events`;
            pool.query(sql4, (err, result, field) => {
                total_events = result[0].total_events
                return res.json({
                    'total_patients': total_patient,
                    'total_donors': total_donor,
                    'total_requests': total_request,
                    'total_events': total_events
                })
            })
        })

    },
    addUser: async(req,res) => {
        const user_data = `SELECT * FROM user WHERE email = '${req.body.email}'`;
        pool.query(user_data,(err,result,fields) => {
            if(Object.keys(result).length>0)
            {
                return res.json({status:0,msg:"Email Already exist"});
            }
            else {

                var ciphertext = CryptoJS.AES.encrypt(req.body.password, 'jkhkefheuf398rubjkvebkeejvn').toString();

                const sql = `INSERT INTO user 
                (first_name,last_name,cnic,phone_no,age,blood_group,email,password,user_role,status,address,gender,availability) 
                VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.cnic}','${req.body.phoneNo}','${req.body.age}',
                '${req.body.blood}','${req.body.email}','${ciphertext}','${req.body.user_role}','${req.body.donor_status}','${req.body.address}',
                '${req.body.gender}','')`;
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
    editUser: async(req,res) => {
        const {id} = req.params;
        console.log(id);
        const sql = `UPDATE user SET first_name = '${req.body.firstName}', last_name = '${req.body.lastName}',
        cnic = '${req.body.cnic}', phone_no = '${req.body.phoneNo}', age = '${req.body.age}',blood_group = '${req.body.blood}',
        user_role = '${req.body.user_role}', status = '${req.body.donor_status}', address = '${req.body.address}', gender = '${req.body.gender}',
        availability = '' WHERE id = '${id}'`;

        pool.query(sql,(err,result,fields) => {
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else {
                return res.json({status:2,msg:"User update successfully!!"});
            }
        })
    },
    deleteUser: async(req,res) => {
        const {id} = req.params;
        const sql = `DELETE FROM user where id = '${id}'`;
        pool.query(sql,(err,result,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else {
                return res.json({status:2,msg:"User deleted Successfully!!"});
            }
        })
    },
    viewUser: async(req,res)=>{
        const {id} = req.params;
        const sql = `SELECT * FROM user WHERE id = '${id}'`;
        pool.query(sql,(err,result,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else if(Object.keys(result).length>0)
            {
                return res.json({status:2,data:result})
            }
            else {
                return res.json({status:1,msg:"No data found"})
            }
        })
    },
    getAllUser: async(req,res)=>{
        const {page,limit} = req.query;
        const sql2 = `SELECT count(*) as user_count FROM user`;
        pool.query(sql2,(err,result,fields)=>{
            const sql = `SELECT * FROM user Limit ${limit} offset ${(page-1)*limit}`;
            const count = result[0].user_count;
            pool.query(sql,(err,result,fields)=>{
                if(err)
                {
                    return res.json({status:1,msg:err});
                }
                else if(Object.keys(result).length>0)
                {
                    return res.json({status:2,count:count,data:result})
                }
                else {
                    return res.json({status:1,count:count,msg:"No data found"})
                }
            })
        })
    }
}