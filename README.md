# SObj
Programming Languages data/objects transmit original format. This is the JavaScript Language version.

## How to use?
This project is based on the `typescript programming language`, so if you would like to use in the web, you should be install the `tsc` compiler toolkit:
1. How to install `tsc`? 
int the command line, input:
> npm install -g typescript
2. How to use?
```javascript
import {SObj} from "SObj";

// sobj string. Is all the sobj's syntax below.
let sobj = `
(sobj
    (name "陈权业")
    (age 32)
    (weight 120)
    (height 182.3)
    (hand (list "leftHand" "rightHand"))
    (heart (sobj (velocity "93/s")
                 (status 'good)))
    (beautiful #t))
`;
let obj = {
    name: "陈权业",
    age: 32,
    weight: 120,
    hand: ["leftHand", "rightHand"],
    heart: {
        velocity: "93/s",
        status: "good"
    },
    beautiful: true
};

// pase sobj to javascript's object
SObj.toObj(sobj);
```
## What is differences between JSON and SObj?
They are the same pointing that use to transmit the data/objects.
## What about SObj, instead of JSON?
1. SObj is smaller than JSON.
2. SObj is more beautiful than JSON.
3. SObj is more user-friendly and more readability.
