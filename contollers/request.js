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
    requestBlood: async (req, res) => {
        const { id } = req.params;
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
    },
    addRequest: async (req, res) => {
        const sql = `INSERT INTO requests (patient_id,unit,blood_group,required_date,status)
        VALUES ('${req.body.id}','${req.body.unit}','${req.body.blood_group}','${req.body.required_date}',
        'PENDING')`;

        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else {
                return res.json({ status: 2, msg: "Request added successfully!!" });
            }
        })
    },
    editRequest: async (req, res) => {
        console.log(req.body);
        const { id } = req.params;
        console.log(id);
        const sql = `UPDATE requests SET unit = '${req.body.unit}', blood_group = '${req.body.blood_group}',
        required_date = '${req.body.date}',status = '${req.body.status}' WHERE id = '${id}'`;
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else {
                return res.json({ status: 2, msg: "Request update successfully!!" });
            }
        })
    },
    deleteRequest: async (req, res) => {
        const { id } = req.params;
        const sql = `DELETE FROM requests WHERE id = '${id}'`;
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else {
                return res.json({ status: 2, msg: "Request deleted Successfully!!" });
            }
        })
    },
    viewRequest: async (req, res) => {
        const { id } = req.params;
        const sql = `SELECT requests.*,user.first_name,user.last_name FROM user INNER JOIN requests
        ON user.id = requests.patient_id WHERE requests.id = '${id}'`;
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else if (Object.keys(results).length > 0) {
                return res.json({ status: 2, data: results });
            }
            else {
                return res.json({ status: 2, msg: "No data found" });
            }
        })
    },
    getAllRequest: async (req, res) => {
        const { page, limit } = req.query;
        const sql = `SELECT count(*) as total_count FROM user INNER JOIN requests ON user.id = requests.patient_id;
        SELECT requests.*,user.first_name,user.last_name FROM requests INNER JOIN user ON requests.patient_id = user.id  Limit ${limit} offset ${(page - 1) * limit};`;
        pool.query(sql, [1, 2], (err, results, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else if (results[0][0].total_count > 0) {
                return res.json({ status: 2, count: results[0][0].total_count, data: results[1] });
            }
            else {
                return res.json({ status: 2, count: results[0][0].total_count, msg: "No data found" });
            }
        })
    },
    bulkDeleteRequest: async (req, res) => {
        const ids = "(" + req.body.deleteData.toString() + ")";
        const sql = `DELETE FROM requests WHERE id IN ${ids}`;
        pool.query(sql, (err, result, fields) => {
            if (err)
                return res.json({ status: 1, msg: err });
            else
                return res.json({ status: 2, msg: "Request deleted successfully!!" });
        })
    },
    searchRequest: async (req, res) => {
        const { page, limit } = req.query;
        const sql = `SELECT count(*) as total_count FROM user INNER JOIN
        requests ON user.id = requests.patient_id WHERE user.first_name LIKE '%${req.body.keyword}%' OR 
        user.last_name LIKE '%${req.body.keyword}%' OR requests.blood_group LIKE '%${req.body.keyword}%' OR 
        requests.required_date LIKE '%${req.body.keyword}%' OR requests.status LIKE '%${req.body.keyword}%';SELECT user.first_name,user.last_name,requests.* FROM user INNER JOIN
        requests ON user.id = requests.patient_id WHERE user.first_name LIKE '%${req.body.keyword}%' OR 
        user.last_name LIKE '%${req.body.keyword}%' OR requests.blood_group LIKE '%${req.body.keyword}%' OR 
        requests.required_date LIKE '%${req.body.keyword}%' OR requests.status LIKE '%${req.body.keyword}%'
        Limit ${limit} offset ${(page - 1) * limit}`;
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
    approveRequest: async (req, res) => {
        const { id } = req.body;
        const sql = `INSERT INTO requests (patient_id,unit,remaning_unit,blood_group,required_date,status)
        VALUES ('${req.body.id}','${req.body.unit}','${req.body.unit}','${req.body.blood_group}','${req.body.required_date}',
        'PENDING')`;
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else {
                pool.query(`SELECT * FROM requests ORDER BY id LIMIT 1`, (err, results, fields) => {
                    pool.query(`SELECT * FROM requests ORDER BY id LIMIT 1;SELECT * FROM user WHERE blood_group = '${results[0].blood_group}' AND user_role = 3
                    AND availability = 'Available' LIMIT ${results[0].unit}`, (err, results, fields, remaning_unit, request_id) => {
                        if (err) {
                            return res.json({ status: 1, msg: err });
                        }
                        else if (Object.keys(results).length > 0) {
                            let rem_unit = results[0][0].remaning_unit;
                            let req_id = results[0][0].patient_id
                            let request_id = results[0][0].id
                            let date = new Date().toJSON().slice(0, 10);
                            results[1].map((val) => {
                                const sql = `INSERT INTO events (patient_id,donor_id,donation_date,donation_time,status,blood_unit)
                                        VALUES ('${id}', '${val?.id}','${results[0][0].required_date}','02:00 PM','Pending','1');
                                        UPDATE user SET availability = 'not_available' WHERE id = ${val?.id};
                                        UPDATE requests SET remaning_unit = ${rem_unit - 1} WHERE id = ${request_id}`;
                                rem_unit = rem_unit - 1;
                                var x = pool.query(sql);
                            })
                            return res.json({ status: 2, msg: "Request Approve successfully!!" });
                        }
                        else {
                            return res.json({ status: 0, msg: "No Donor Available Yet!!" });
                        }
                    })
                });
            }
        })
    },
    patientRequest: async (req, res) => {
        const { id } = req.params;
        const sql = `SELECT requests.*,user.first_name,user.last_name FROM requests INNER JOIN user ON user.id = requests.patient_id
        WHERE requests.patient_id = '${id}'`;
        pool.query(sql, (err, results, fields) => {
            if (err) {
                return res.json({ status: 1, msg: err });
            }
            else if (Object.keys(results).length > 0) {
                return res.json({ status: 2, data: results });
            }
            else {
                return res.json({ status: 0, msg: "No data found" });
            }
        })
    }
}