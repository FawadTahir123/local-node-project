const { createPool } = require('mysql')

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "blood",
    connectionLimit: 10
})
module.exports = {
    requestBlood: async (req, res) => {
        const {id} = req.params;
        console.log(id);
        const sql = `INSERT INTO requests (patient_id,unit,blood_group,required_date,status)
        VALUES ('${id}','${req.body.units}','${req.body.blood_group}','${req.body.date}','${req.body.status}')`;
        pool.query(sql, (err, result, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err })
            }
            else {
                return res.json({ status: 2, msg: 'Request added successfully!!' });
            }
        })
    }
}