//import SObj from "SObj";

// toObj test
let normalSobj = `
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