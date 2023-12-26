const { randomInt } = require("crypto");

let rot = {}
let maxVal = 65+26;

//fill
for(let i = 65; i<maxVal; i++) {
    let letter = String.fromCharCode(i);
    rot[letter] = letter;
}

//Scramble
for(let j = 0; j<10; j++) {
    for(let i = 65; i<maxVal; i++) {
        let letter = String.fromCharCode(i);

        let swap = rot[letter];
        let randPos = randomInt(65, maxVal);
        
        rot[letter] = rot[String.fromCharCode(randPos)];
        rot[String.fromCharCode(randPos)] = swap;
    }
}


console.log(JSON.stringify(rot))