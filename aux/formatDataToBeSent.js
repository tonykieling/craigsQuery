
const { sendEmail }  = require("./sendEmail.js");
const ejs            = require('ejs');
const dateFormat     = require('dateformat');

// it formats the data to be sent by the email function
// it is called just when need to send email, right before that
formatDataToBeSent = (list, flag, gMinPrice, gMaxPrice) => {
    ejs.renderFile("./aux/formatHTML.ejs", {list, gMinPrice, gMaxPrice}, options, function(err, result){
      if (err)
        console.log("### err", err);
      else {
        const d = new Date(),
              utc = d.getTime() + (d.getTimezoneOffset() * 60000),
              nd = new Date(utc + (3600000*-7));
  
        let subject = "";
  
        if (flag === "first")
          subject = `fromZero - ${dateFormat(nd, "@HH:MM - dddd  -  dd/mm/yyyy")}`;
        else
          subject = `${dateFormat(nd, "@HH:MM - dddd  -  dd/mm/yyyy")}`;
  
        sendEmail(result, subject);
      }
    });
  }

module.exports = { formatDataToBeSent };