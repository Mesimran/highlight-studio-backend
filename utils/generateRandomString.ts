export function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  
    //specify the length for the new string
    const lenString = 7;
    let randomstring = "";
  
    //loop to select a new character in each iteration
    for (let i = 0; i < lenString; i++) {
      const rnum = Math.floor(Math.random() * characters.length);
      randomstring += characters.substring(rnum, rnum + 1);
    }
  
    return randomstring;
  }
  