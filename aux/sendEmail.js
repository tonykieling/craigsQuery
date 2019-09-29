require("dotenv").config();
const mailgun     = require("mailgun-js");
const mg          = mailgun({apiKey: process.env.APIKEY, domain: process.env.DOMAIN});


// function to send email using MailGun
sendEmail = (content, subject) => {
    const data = {
      from    : "Mailgun Sandbox <postmaster@sandbox002b4d3efa304a4a92fa6ba15da0460f.mailgun.org>",
      to      : process.env.TO,
      // cc      : process.env.CC,
      subject,
      html    : content
      // text    : content
    };
    
    mg.messages().send(data, function (error, body) {
      console.log("### sending email ==> ", body.message);
    });  
  }


module.exports = { sendEmail };
