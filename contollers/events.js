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
        const sql = `SELECT events.donor_id,events.status as event_status,events.donation_date,events.blood_unit,user.* 
        FROM events INNER JOIN user ON events.donor_id = user.id WHERE events.patient_id = ${id}`;
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
        const sql = `SELECT events.patient_id,events.status as event_status,events.donation_date,events.blood_unit,user.* 
        FROM events INNER JOIN user ON events.patient_id = user.id WHERE events.donor_id = ${id}`;
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
    addEvents:async(req,res)=>{
        
        const sql = `INSERT INTO events 
        (patient_id,donor_id,donation_date,donation_time,status,blood_unit)
        VALUES ('${req.body.patient_id}','${req.body.donor_id}','${req.body.donation_date}','02:00 PM', 'Pending', '1');`;
        pool.query(sql,(err,results,fields)=>{
            if(err)
            {
                return res.json({status:1,msg:err});
            }
            else {
                const sql = `SELECT * FROM requests WHERE id = '${req.body.requestID}'`;
                pool.query(sql,(err,results,fields)=>{
                    if(err){
                        return res.json({status:1,msg:err});
                    }
                    else{
                        // console.log(results);
                        remaining_unit = results[0].remaning_unit
                        const sql = `UPDATE requests SET remaning_unit = ${remaining_unit-1} AND status = 'IN-PROGRESS' WHERE id = '${results[0].id}';
                        SELECT id ,remaning_unit FROM requests WHERE id = '${results[0].id}'`;
                        pool.query(sql,(err,results,fields)=>{
                            if(err) 
                            {
                                return res.json({status:1,msg:err});
                            }
                            else
                            {
                            const remaning_unit = results[1][0].remaning_unit
                            // console.log(results[0].id, "efqef");
                            console.log(remaning_unit);
                            console.log(results);
                            if(remaning_unit === 0)
                            {
                                const sql = `UPDATE requests SET status = 'COMPLETED' WHERE id = '${results[1][0].id}'`
                                pool.query(sql, (err,results,fields)=>{
                                    if(err)
                                    {
                                        return res.json({status:1,msg:err});
                                    }
                                    else
                                    {
                                        return res.json({status:1,msg:"Event Generated Successfully"});
                                    }
                                })
                            }
                            return res.json({status:1,msg:"Event Generated Successfully"});

                            }
                        })
                        // return res.json({status:2, data:results});
                    }
                })
                // return res.json({status:1,msg:"Event Generated Successfully"});
            }
        })
    },
    getAllEvents:async(req,res) => {
        const sql = `SELECT events.*,user.first_name,user.last_name,user.account_status as user_status FROM events INNER JOIN user 
        ON events.patient_id = user.id;SELECT events.*,user.first_name,user.last_name,user.account_status as user_status, user.blood_group FROM events
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