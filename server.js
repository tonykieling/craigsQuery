// https://www.npmjs.com/package/node-craigslist
// dotenv
// mailgun

const dateFormat = require('dateformat');
let ejs = require('ejs');
require("dotenv").config();
const mailgun = require("mailgun-js");

const mg = mailgun({apiKey: process.env.APIKEY, domain: process.env.DOMAIN});
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
    },
    {
      name            : "KingEdward",
      postal          : "V5Z2C4",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    },
    {
      name            : "CityHall",
      postal          : "V5Z2V2",
      category        : generalOptions.category,
      searchDistance  : generalOptions.searchDistance,
      minPrice        : generalOptions.minPrice,
      maxPrice        : generalOptions.maxPrice
    }
  ];



// this function only checks whether the data before and current are the same
// if so, the system may not send the email because nothing has changed
hasChange = (before, current) => {
  let someChange = false;
  let internalChange = false;
  for (let c of current)
    for (let b of before)
      if (b.name === c.name) {
        for (let objC of c) {
          let countC = 0;
          for (let objB of b) {
            if (objB.pid === objC.pid) {
              objB.flag = true;
              if (objB.price !== objC.price) {
                objC.modify     = "Changed";
                someChange       = true;
                internalChange  = true;
              }
              break;
            } else {
              countC += 1;
              if (countC === b.length) {
                someChange       = true;
                objC.modify     = "New";
                internalChange  = true;
                break;
              }
            }
          }
        }
        if (internalChange)
          for (let objB of b)
            if (!objB.flag) {
              objB.modify = "Deleted";
              someChange   = true;
              c.push(objB);
            }
      }
  return(someChange && current);
}



// function to send email using MailGun
sendEmail = (content, subject) => {
  const data = {
    from    : "Mailgun Sandbox <postmaster@sandbox002b4d3efa304a4a92fa6ba15da0460f.mailgun.org>",
    to      : process.env.TO,
    cc      : process.env.CC,
    subject,
    html    : content
    // text    : content
  };
  
  mg.messages().send(data, function (error, body) {
    console.log("body", body);
  });  
}



// it formats the data to be sent by the email function
formatDataToBeSent = (list, flag) => {
  ejs.renderFile("./formatHTML.ejs", {list, gMinPrice, gMaxPrice}, options, function(err, result){
    if (err)
      console.log("### err", err);
    else {
      let subject = "";

      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const nd = new Date(utc + (3600000*-7));


      switch(flag) {
        case "first":
          subject = `${dateFormat(nd, "@HH:MM - dddd  -  mm/dd/yyyy")}`;
          break;
        case "new":
          subject = `NEW ${dateFormat(nd, "@HH:MM - dddd  -  mm/dd/yyyy")}`;
          break;
        case "same":
          subject = `same ${dateFormat(nd, "@HH:MM - dddd  -  mm/dd/yyyy")}`;
          break;
        default:
          subject = flag;
          break;
      }
      sendEmail(result, subject);
    }
  });
}



// main function of the system
mainFunc = async () => {
  console.log("@mainFunc");

  const getList = await options.map(async item => {
    const eachItem = await client.list(item);
    eachItem["name"] = item.name;
    return eachItem;
  });
  const list = await Promise.all(getList);

  if (await !beforeData){
    // first time the system runs it send the email with the received data from craigslist
    console.log("FIRST TIME");
    const flag = "first";
    formatDataToBeSent(list, flag);

  } else {
    // it calls a function to compare list and beforeData, if there are changes
    // if they are diff, the system send the email
    const cTime = new Date();
    const queryToHasChange = await hasChange(beforeData, list);
    if (queryToHasChange){
      console.log("DIFFERENT DATA!!!!!!!", dateFormat(cTime, "HH:MM"));
      const flag = "new";
      formatDataToBeSent(list, flag);
    } else if (((dateFormat(cTime, "HH")) === 8  && (dateFormat(cTime, "MM")) === 0) ||
              (((dateFormat(cTime, "HH")) === 18 && (dateFormat(cTime, "MM")) === 0))) {
      console.log("+++ GOGOGOGO @", dateFormat(cTime, "HH:MM"));
      const flag = "same" + dateFormat(cTime, "@HH:MM - dddd  -  mm/dd/yyyy");
      formatDataToBeSent(list, flag);        
    } else
      console.log(" no changes @", dateFormat(cTime, "HH:MM"));
  }

  beforeData = null;
  beforeData = [...list];
}



mainController = () => {
  // this is the time controller of the application
  console.log("@inside mainController");
  mainFunc();
  clearInterval(secondT);
  let interval    = 1000 * 60 * 15;
  const timeDay   = 1000 * 60 * 15;
  const timeNight = 1000 * 60 * 30;
  setInterval(() => {
    const currentTime = new Date();
    console.log(`\n# running @${dateFormat(currentTime, "HH:MM:ss")}`);
    if ((dateFormat(currentTime, "HH")) > 6 &&
        (dateFormat(currentTime, "HH") < 22))
      interval = timeDay;
    else
      interval = timeNight;

    console.log("calling mainFunc()")
    mainFunc();
  }, interval);
}




// this is the function to round the timer to multiple of 15 minutes
// it's gonna be executed only once
fFifteen = () => {
  console.log("@inside fFifteen")
  clearInterval(firstT);
  secondT = setInterval(() => {
    const cTime = Number(dateFormat(new Date(), "MM"));
    console.log(`\n#15sec running @${cTime}`);
    if ((cTime % 15) === 0)
      mainController();
  }, (1000 * 60));
}



// function to clock's syncronize
// it will be trigged when the timer gets 0 seconds in order to start each fifteen iterarion at zero seconds
// it's gonna be executed only once
fZero = () => {
  console.log("@inside fZero");
  firstT = setInterval(() => {
    const t = Number(dateFormat(new Date(), "ss"));
    console.log("time = ", t);
    if (t === 0) {
      console.log("0000", dateFormat(t, "HH:MM"));
      fFifteen();
    }
  }, 1000);
}


// it runs at the very beggining to send the first email
// it runs only once
console.log(`\n# 1111running @${dateFormat(new Date(), "HH:MM:ss")}`);
mainFunc();
let firstT  = null;
let secondT = null;
fZero();