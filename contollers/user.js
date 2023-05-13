const { createPool } = require('mysql')

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "blood",
    connectionLimit: 10,
    multipleStatements: true
})
module.exports = {
    cardsData: async (req, res) => {
        const sql = `SELECT count(*) as patient_count from user WHERE user_role = '2';SELECT count(*) as donor_count from user WHERE user_role = '3';
        SELECT count(*) as total_request FROM requests;SELECT count(*) as total_events FROM events`;
        pool.query(sql, (err, results, fields) => {
            console.log(results[1][0].donor_count);
            const total_patient = results[0][0].patient_count;
            const total_donor = results[1][0].donor_count;
            const total_request = results[2][0].total_request;
            const total_events = results[3][0].total_events;
            return res.json({
                'total_patients': total_patient,
                'total_donors': total_donor,
                'total_requests': total_request,
                'total_events': total_events
            })
        })
    },
    addUser: async (req, res) => {
        console.log(req.body);
        const user_data = `SELECT * FROM user WHERE email = '${req.body.email}'`;
        pool.query(user_data, (err, result, fields) => {
            if (Object.keys(result).length > 0) {
                return res.json({ status: 0, msg: "Email Already exist" });
            }
            else {

                const sql = `INSERT INTO user 
                (first_name,last_name,cnic,phone_no,age,blood_group,email,password,user_role,account_status,address,gender,availability) 
                VALUES ('${req.body.first_name}','${req.body.last_name}','${req.body.cnic}','${req.body.phone_no}','${req.body.age}',
                '${req.body.blood_group}','${req.body.email}','','${req.body.user_role}','${req.body.account_status}','${req.body.address}',
                '${req.body.gender}','${req.body.availability}')`;
                pool.query(sql, (err, result, fields) => {
                    if (err) {
                        return res.json({ status: 1, msg: err })
                    }
                    else {
                        return res.json({ status: 2, msg: 'User registered successfully!!' })
                    }
                })
            }
        })
    },
    editUser: async (req, res) => {
        const { id } = req.params;
        const sql = `UPDATE user SET first_name = '${req.body.first_name}', last_name = '${req.body.last_name}',
        cnic = '${req.body.cnic}', phone_no = '${req.body.phone_no}', age = '${req.body.age}',blood_group = '${req.body.blood_group}',
        user_role = '${req.body.user_role}', status = '${req.body.status}', address = '${req.body.address}', gender = '${req.body.gender}',
        availability = '${req.body.availability}' WHERE id = '${id}'`;

        pool.query(sql, (err, result, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else {
                return res.json({ status: 2, msg: "User update successfully!!" });
            }
        })
    },
    deleteUser: async (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM user where id = '${id}'`;
        pool.query(sql, (err, result, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else {
                return res.json({ status: 2, msg: "User deleted Successfully!!" });
            }
        })
    },
    viewUser: async (req, res) => {
        const { id } = req.params;
        const sql = `SELECT * FROM user WHERE id = '${id}'`;
        pool.query(sql, (err, result, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else if (Object.keys(result).length > 0) {
                return res.json({ status: 2, data: result })
            }
            else {
                return res.json({ status: 1, msg: "No data found" })
            }
        })
    },
    getAllUser: async (req, res) => {
        const { page, limit } = req.query;
        const sql2 = `SELECT count(*) as user_count FROM user`;
        pool.query(sql2, (err, result, fields) => {
            const sql = `SELECT * FROM user Limit ${limit} offset ${(page - 1) * limit}`;
            const count = result[0].user_count;
            pool.query(sql, (err, result, fields) => {
                if (err) {
                    return res.json({ status: 1, msg: err });
                }
                else if (Object.keys(result).length > 0) {
                    return res.json({ status: 2, count: count, data: result })
                }
                else {
                    return res.json({ status: 1, count: count, msg: "No data found" })
                }
            })
        })
    },
    bulkDeleteUser: async (req, res) => {
        const ids = "(" + req.body.deleteData.toString() + ")";
        const sql = `DELETE FROM user WHERE id IN ${ids}`;
        pool.query(sql, (err, result, fields) => {
            if (err)
                return res.json({ status: 1, msg: err });
            else
                return res.json({ status: 2, msg: "User deleted successfully!!" });
        })
    },
    searchUser: async (req, res) => {
        const { page, limit } = req.query;
        const sql = `SELECT count(*) as total_count FROM user WHERE first_name LIKE '%${req.body.keyword}%' AND last_name LIKE 
        '%${req.body.keyword}%' OR cnic LIKE '%${req.body.keyword}%' OR phone_no LIKE '%${req.body.keyword}%' 
        OR blood_group LIKE '%${req.body.keyword}%' OR email LIKE '%${req.body.keyword}%' OR address LIKE 
        '%${req.body.keyword}%';SELECT * FROM user WHERE first_name LIKE '%${req.body.keyword}%' OR last_name LIKE 
        '%${req.body.keyword}%' OR cnic LIKE '%${req.body.keyword}%' OR phone_no LIKE '%${req.body.keyword}%' 
        OR blood_group LIKE '%${req.body.keyword}%' OR email LIKE '%${req.body.keyword}%' OR address LIKE 
        '%${req.body.keyword}%' Limit ${limit} offset ${(page - 1) * limit}`;
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else if (results[0][0].total_count > 0) {
                return res.json({ status: 2, count: results[0][0].total_count, data: results[1] })
            }
            else {
                return res.json({ status: 0, count: results[0][0].total_count, msg: "No data found" })
            }
        })
    },
    updateAvailaibility: (req,res) => {
        const {id} = req.params;
        const sql = `UPDATE user SET availability = '${req.body.availability}' WHERE id = ${id}`;
        pool.query(sql,(err,results,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else {
                if(req.body.availability==="Available")
                {
                    let date = new Date().toJSON().slice(0, 10);
                    const sql = `SELECT * FROM user WHERE id = '${id}'`;
                    pool.query(sql,(err,results,fields)=>{
                        if(err){
                            return res.json({status:1,msg:err});
                        }
                        else {
                            const sql = `SELECT * FROM requests WHERE required_date > '${date}' AND blood_group = '${results[0].blood_group}'
                            AND status = 'approve'`;
                            pool.query(sql,(err,results,fields)=>{
                                if(err)
                                {
                                    console.log(results[0].required_date,'error');
                                    return res.json({status:1,msg:err});
                                }
                                else if(Object.keys(results).length > 0)
                                {
                                    const sql = `INSERT INTO events (patient_id,donor_id,donation_date,donation_time,status,blood_unit)
                                    VALUES ('${results[0].patient_id}', '${id}','${results[0].required_date}','02:00 PM','Pending','1');
                                    UPDATE user SET availability = 'not_available' WHERE id = ${id}`;
                                    pool.query(sql,(err,results,fields)=>{
                                        if(err)
                                        {
                                            return res.json({status:1,msg:err});
                                        }
                                        else {
                                            return res.json({status:2,msg:"Event generated against your Availability"});
                                        }
                                    });
                                }
                                else {
                                    return res.json({status:2,msg:"Availability update successfully!!"});
                                }
                            })
                        }
                    })
                }
                else {
                    return res.json({status:2,msg:"Availability update Successfully!!"});
                }
            }
        })
    },
    updateStatus: async(req,res) => {
        const {id} = req.params;

        const sql = `UPDATE requests SET status = 'Approve' WHERE id = '${id}';`;
        pool.query(sql,(err,results,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else {
                return res.json({status:2,msg:"Request approve successfully!!"});
            }
        })
    },
    getUserAvailability: async(req,res) => {
        const {id} = req.params;
        const sql = `SELECT availability FROM user where id = '${id}'`;
        pool.query(sql,(err,results,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else if(Object.keys(results).length>0){
                return res.json({status:2,data:results});
            }
            else {
                return res.json({status:0,msg:"No data Found"});
            }
        })
    },

    getAllPatients: async (req, res) => {
        const sql2 = `SELECT count(*) as user_count FROM user WHERE user_role = 2`;
        pool.query(sql2, (err, result, fields) => {
            const sql = `SELECT * FROM user WHERE user_role = 2`;
            const count = result[0].user_count;
            pool.query(sql, (err, result, fields) => {
                if (err) {
                    return res.json({ status: 1, msg: err });
                }
                else if (Object.keys(result).length > 0) {
                    return res.json({ status: 2, count: count, data: result })
                }
                else {
                    return res.json({ status: 1, count: count, msg: "No data found" })
                }
            })
        })
    },
}