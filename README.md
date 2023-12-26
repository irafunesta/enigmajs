# enigmajs
Simple implementation of the enigma machine used in WW2

# Requirements
Node v14+

# Configuration
- Setup the configuration of the machine copying from `enigma-config.json`
- Rotors are in the `rotors` array
- `fixedRot` is the deflector or UKW
- `cablesMap` are the cables in front of the machine
- `rotorsSettings` set what rotors are used and the order

# Run
To run the code just run the enigma.js from Node
 ```
    node enigma.js <config.json> decode | encode message
  ```
  eg.
  ```
    enigma.js ./enigma-config.json encode "HELLO WORLD"
    enigma.js ./enigma-config.json decode "AJHAG QAXGX"
  ```

# Notes
- `fixedRot` and `cablesMap` , needs to be mapped as circular eg.( A->B, B->A, X->Z, Z->X)
- for now only supports uppercase letters (A - Z) other characters are ignored
- use `scrable-rotors.js` to create a random rotor

