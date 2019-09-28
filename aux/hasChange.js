// this function only checks whether the data before and current are the same
// if so, the system may not send the email because nothing has changed
hasChange = (before, current) => {
    let someChange = false;
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
                  someChange      = true;
                }
                break;
              } else {
                countC += 1;
                if (countC === b.length) {
                  someChange      = true;
                  objC.modify     = "New";
                  break;
                }
              }
            }
          }
          for (let objB of b)
            if (!objB.flag) {
              objB.modify  = "Deleted";
              someChange   = true;
              c.push(objB);
            }
        }
    return(someChange && current);
  }

  module.exports = { hasChange };