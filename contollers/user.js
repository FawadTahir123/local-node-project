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

    }
}