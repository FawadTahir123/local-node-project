const { createPool } = require('mysql')

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "blood",
    connectionLimit: 10,
    multipleStatements:true
})
module.exports = {
    patientEvents: async(req,res)=>{
        const {id} = req.params;
        const sql = `SELECT events.donor_id,events.status as event_status,events.donation_date,user.* FROM events INNER JOIN user ON events.patient_id = user.id
        WHERE events.donor_id = ${id}`;
        pool.query(sql,(err,results,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else if(Object.keys(results).length>0)
            {
                return res.json({status:2,data:results});
            }
            else {
                return res.json({status:1,msg:"No data found"});
            }
        })
    },
    donorEvents:async(req,res)=>{
        const {id} = req.params;
        const sql = `SELECT events.patient_id,events.status as event_status,events.donation_date,user.* FROM events INNER JOIN user ON events.donor_id = user.id
        WHERE events.patient_id = ${id}`;
        pool.query(sql,(err,results,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else if(Object.keys(results).length>0)
            {
                return res.json({status:2,data:results});
            }
            else {
                return res.json({status:1,msg:"No data found"});
            }
        })
    },
    getAllEvents:async(req,res) => {
        const sql = `SELECT events.*,user.first_name,user.last_name,user.status as user_status FROM events INNER JOIN user 
        ON events.patient_id = user.id;SELECT events.*,user.first_name,user.last_name,user.status as user_status FROM events
        INNER JOIN user ON events.donor_id = user.id;`
        pool.query(sql,(err,results,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err})
            }
            else if(Object.keys(results).length>0){
                return res.json({status:2,data:[results[0],results[1]]});
            }
            else {
                return res.json({status:0,msg:"No data Found"});
            }
        })
    }
}