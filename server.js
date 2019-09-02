// https://www.npmjs.com/package/node-craigslist
// dotenv
// mailgun

const dateFormat = require('dateformat');
let ejs = require('ejs');
require("dotenv").config();
const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: process.env.APIKEY, domain: process.env.DOMAIN});

let countTimesWhithoutSendEmail = 1;    // variable to count how many times the same data and no sending email
const maxTimesWhithoutSendEmail = 4;    // constant to set the maximum times whithout no sending email with same data
// const frequencyCheck            = 15 * 60 * 1000; // constant that sets the time (in millisecs) so the system is query craiglists
const frequencyCheck            = 4000; // constant that sets the time (in millisecs) so the system is query craiglists
const gMinPrice                 = 1100;
const gMaxPrice                 = 1350;

let beforeData = null;
const
  craigslist = require('node-craigslist'),
  client = new craigslist.Client({
    city : 'vancouver',
  }),
  generalOptions = {
      category        : "apa",
      searchDistance  : 1,
      minPrice        : gMinPrice,
      maxPrice        : gMaxPrice
  }
  options = [
    {
      name            : "Langara",
      postal          : "V5Y2Z9",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    },
    {
      name            : "Oakridge",
      postal          : "V5Z4H2",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    },
    {
      name            : "MarineDrive",
      postal          : "V5X0C7",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    }
  ];



// this function only checks whether the data before and current are the same
// if so, the system may not send the email because nothing has changed
isEqual = (before, current) => {
  for (let b in before)
    for (let c in current)
      if (current[c].name === before[b].name)
        for (let objB of before[b]) {
          let count = 0;
          for (let objC in current[c]) {
            count += 1;
            if (objB.pid === current[c][objC].pid)
              break;
            else
              if (count === current[c].length || count === before[b].length)
                return false;
          }
        }
  return true;
}



// function to send email using MailGun
sendEmail = (content, subject) => {
  const data = {
    from    : "Mailgun Sandbox <postmaster@sandbox002b4d3efa304a4a92fa6ba15da0460f.mailgun.org>",
    to      : process.env.TO,
    cc      : process.env.CC,
    subject,
    // subject : `${dateFormat(new Date(), "@HH:MM - dddd  -  mm/dd/yyyy")} - Price range = $${gMinPrice}-$${gMaxPrice}`,
    html    : content
    // text    : content
  };
  
  mg.messages().send(data, function (error, body) {
    console.log("body", body);
  });  
}



// it formats the data to be sent by the email function
formatDataToBeSent = (list, beforeData, flag) => {
  ejs.renderFile("./formatHTML.ejs", {list, beforeData, gMinPrice, gMaxPrice}, options, function(err, result){
    if (err)
      console.log("### err", err);
    else {
      let subject = "";
      switch(flag) {
        case "first":
          subject = `${dateFormat(new Date(), "@HH:MM - dddd  -  mm/dd/yyyy")}`;
          // subject = `${dateFormat(new Date(), "@HH:MM - dddd  -  mm/dd/yyyy")} - Price range = $${gMinPrice}-$${gMaxPrice}`
          break;
        case "new":
          subject = `NEW ${dateFormat(new Date(), "@HH:MM - dddd  -  mm/dd/yyyy")}`;
          break;
        case "same":
          subject = `same ${dateFormat(new Date(), "@HH:MM - dddd  -  mm/dd/yyyy")}`;
          break;
      }
      sendEmail(result, subject);
      // console.log("BEFORE=================", result);
      // console.log("SENDING_EMAILLLLLLLLLLLLLLLLLLLLLLLLLLL");
    }
  });
}

// main function of the system
myFunc = async () => {
  const getList = await options.map(async item => {
    const eachItem = await client.list(item);
    eachItem["name"] = item.name;
    return eachItem;
  });
  const list = await Promise.all(getList);

  // console.log("list", list);
  if (await !beforeData){
    // first time the system runs it send the email with the received data from craigslist
    console.log("FIRST TIME");
    const flag = "first";
    beforeData = null;
    formatDataToBeSent(list, beforeData, flag);

  } else {
    // it calls a function to compare list and beforeData, if there are changes
    // if they are diff, the system send the email
    if (await !isEqual(beforeData, list) || await !isEqual(list, beforeData)){
      console.log("DIFFERENT DATA!!!!!!!!!!!!!!!!!!!!1");
      const flag = "new";
      formatDataToBeSent(list, beforeData, flag);
    } else {
      console.log("checking how many times with the same data");
      console.log("\t\tcount = ", countTimesWhithoutSendEmail);
      if ((countTimesWhithoutSendEmail += 1) > maxTimesWhithoutSendEmail) {
        // if the maximum timeswhithout sending email is reached,
        // should set zero to its variable and send the email
        console.log("+++ MAXIMUM TIMES NO SENDING REACHED, LET'S SEND THE EMAIL ANYWAYS GOGOGOGO");
        countTimesWhithoutSendEmail = 1;
        const flag = "same";
        beforeData = null;
        formatDataToBeSent(list, beforeData, flag);
      }
    }
  }

  beforeData = [...list];
}


console.log(`\n# running @${dateFormat(new Date(), "HH:MM")}`);
myFunc();

// this is the time controller of the application
setInterval(() => {
  console.log(`\n# running @${dateFormat(new Date(), "HH:MM")}`);
  if ((dateFormat(new Date(), "HH")) > 8 && (dateFormat(new Date(), "HH")) < 20)
    console.log("time is btw 8 - 20 hr");
    myFunc();
}, frequencyCheck);

