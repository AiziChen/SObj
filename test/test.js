//import SObj from "SObj";

// toObj test
let normalSobj = `
(*obj
    (name "陈权业")
    (age 32)
    (weight 120)
    (height 182.3)
    (hand (list "leftHand" "rightHand"
            (*list 'good 'foo 'bar) (list "ok" #t)
            (*obj (status 'good) (blood #t))))
    (heart (sobj (velocity "93/s")
                 (status 'good)
                 (status2 (*list "yes" 'ok #t))))
    (beautiful #t))
`;
let arraySobj = `
(*list (*obj
    (name "陈权业")
    (age 32)
    (weight 120)
    (height 182.3)
    (hand (*list "leftHand" "rightHand"))
    (heart (*obj (velocity "93/s")
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
console.log(JSON.stringify(toObj(normalSobj)));
console.log(trimSObj(normalSobj));