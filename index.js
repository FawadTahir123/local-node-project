const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { createPool } = require("mysql");

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "blood",
  connectionLimit: 10,
  multipleStatements: true,
});

module.exports = {
  getEmails: async (req, res) => {
    let date = new Date().toJSON().slice(0, 10);
    const sql = `SELECT  user.email FROM events INNER JOIN user ON events.donor_id = user.id WHERE ABS(DATEDIFF(donation_date, '${date}')) = 2 OR DATEDIFF('${date}', donation_date) = 2`;
    pool.query(sql, (err, result, fields) => {
      if (err) {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
      } else {
        result.forEach((element) => {
          var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: false,
            requireTLS: true,

            auth: {
              user: "fawadtahir.te@gmail.com",
              pass: "pjduwuohnnvbmnyp",
            },
          });
          const mailOptions = {
            from: "fawadtahir.te@gmail.com", // sender address
            to: element.email, // reciever address
            subject: "Donation Reminder",
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err);
            else console.log(info);
          });
        });
      }
    });
  },
};
