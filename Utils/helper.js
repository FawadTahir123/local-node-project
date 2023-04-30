const { createPool } = require('mysql')

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "blood",
    connectionLimit: 10
})

module.exports = {
    totalPatients: async(req,res) => {
        const sql = `SELECT count(*) as patient_count from user WHERE user_role = '2'`;
        pool.query(sql,(err,result,field) => {
            return result[0].patient_count
        })
    },
    totalDonors: async(req,res) => {
        const sql = `SELECT count(*) as donor_count from user WHERE user_role = '3'`;
        pool.query(sql,(err,result,field) => {
            return result[0].donor_count
        })
    },
    totalRequest: async(req,res) => {
        const sql = `SELECT count(*) as total_request FROM requests`;
        pool.query(sql,(err,result,field) => {
            return result[0].total_request
        })
    },
    totalEvents: async(req,res) => {
        const sql = `SELECT count(*) as total_events FROM events`;
        pool.query(sql,(err,result,field) => {
            return result[0].total_events
        })
    }
}