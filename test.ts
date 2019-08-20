import {SObj} from "SObj";

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

SObj.toObj(sobj);