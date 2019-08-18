const dateFormat = require('dateformat');
dateFormat(new Date(), "dddd  -  mmmm dS, yyyy  -  HH:MM"),

setInterval(() => {
  console.log("running");
  if ((dateFormat(new Date(), "HH")) > 8 && (dateFormat(new Date(), "HH")) < 20)
    console.log("time is btw 8 - 20 hr")
}, 15000);