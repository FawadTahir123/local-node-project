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
        console.log(err);
      } else {
        
        result.forEach((element) => {
          console.log(element.email);
          var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',//process.env.EMAIL_HOST,
            service:'gmail', //process.env.SERVICE,
            port: 587,
            secure: false,
            requireTLS: true,

            auth: {
              user:'fawadtahir.te@gmail.com', //process.env.EMAIL_USER,
              pass: 'pjduwuohnnvbmnyp', //process.env.EMAIL_PASS,
            },
          });
          const mailOptions = {
            from: 'fawadtahir.te@gmail.com',//process.env.EMAIL_USER, // sender address
            to: element.email, // reciever address
            subject: "Donation Reminder",
            html: '<p>hi your meeting in just 15 min</p>'
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
