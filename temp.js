const list = [
  [
    {
      pid   : 1,
      price : 10,
      url   : "http://1111111111111",
      title : "TITLE 11111111111111"
    },
    {
      pid   : 2,
      price : 20,
      url   : "http://2222222222222",
      title : "TITLE 22222222222222"
    }
  ],
  [
    {
      pid   : 3,
      price : 300,
      url   : "http://3333333333333",
      title : "TITLE 33333333333333"
    },
    {
      pid   : 5,
      price : 500,
      url   : "http://5555555555555",
      title : "TITLE 55555555555555"
    }
  ]
];
list[0].name = "Langara";
list[1].name = "Oakridge";


const beforeData = [
  [
    {
      pid   : 1,
      price : 10,
      url   : "http://1111111111111",
      title : "TITLE 11111111111111"
    },
    {
      pid   : 2,
      price : 20,
      url   : "http://2222222222222",
      title : "TITLE 22222222222222"
    }
  ],
  [
    {
      pid   : 3,
      price : 30,
      url   : "http://3333333333333",
      title : "TITLE 33333333333333"
    },
    {
      pid   : 4,
      price : 40,
      url   : "http://4444444444444",
      title : "TITLE 44444444444444"
    }
  ]
];
beforeData[0].name = "Langara";
beforeData[1].name = "Oakridge";


// this function only checks whether the data before and current are the same
// if so, the system may not send the email because nothing has changed
isEqual = (before, current) => {
  let noChange = true;
  for (let c of current)
    for (let b of before)
      if (b.name === c.name) {
        for (let objC of c) {
          let countC = 0;
          for (let objB of b) {
            if (objB.pid === objC.pid) {
              objB.flag = true;
              if (objB.price !== objC.price) {
                objC.modify = "Changed";
                noChange = false;
              }
              break;
            } else {
              countC += 1;
              if (countC === b.length) {
                noChange = false;
                objC.modify = "New";
                break;
              }
            }
          }
        }
        for (let objB of b)
          if (!objB.flag) {
            objB.modify = "Deleted";
            noChange = false;
            c.push(objB);
          }
      }
  return(noChange || current);
}

compareLists = (beforeData, list) => {
  console.log("###beforeData", beforeData);
  console.log("###current", list);
  return isEqual(beforeData, list);
}

console.log(compareLists(beforeData, list));