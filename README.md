# SObj
Programming Languages data/objects transmit original format. This is the JavaScript Language version.

## How to use?
This project is based on the `typescript` programming language, so if you would like to use in the web, you should be install the `tsc` compiler:
1. How to install `tsc`? 
int the command line, input:
> npm install -g typescript

2. Run the test.
First, your should compiler the `SObj.ts` library to the `SObj.js`, that use this command:
> tsc -lib es6 SObj.ts

Then, use the browser to open the `test/test.html` page. now you open the browser developer-tools to see it presents.
The test.js code is:
```javascript
// toObj test
let normalSobj = `
(sobj
    (name "陈权业")
    (age 32)
    (weight 120)
    (height 182.3)
    (hand (list "leftHand" "rightHand"
            (list 'good 'foo 'bar) (list "ok" #t)
            (sobj (status 'good) (blood #t))))
    (heart (sobj (velocity "93/s")
                 (status 'good)
                 (status2 (list "yes" 'ok #t))))
    (beautiful #t))
`;
let arraySobj = `
(list (sobj
    (name "陈权业")
    (age 32)
    (weight 120)
    (height 182.3)
    (hand (list "leftHand" "rightHand"))
    (heart (sobj (velocity "93/s")
                 (status 'good)))
    (beautiful #t)))
`;
console.log(toObj(normalSobj));
console.log(toObj(arraySobj));

// toSObj test
let normalObj = {
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
console.log(toSObj(normalObj));
console.log(toObj(toSObj(toObj(arraySobj))));
```
3. How to use?
First, you would compile the `SObj.ts` to the `SObj.sj` file.
> tsc -lib es6 SObj.ts

Then, you can use in the web develpments.

## What are differences between JSON and SObj?
They are the same pointing that use to transmit the data/objects.
## What about SObj, instead of JSON?
1. SObj is smaller than JSON.
2. SObj is more beautiful than JSON.
3. SObj is more user-friendly and more readability.
