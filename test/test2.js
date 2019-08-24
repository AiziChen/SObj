let userSobj = `
    (sobj
        (name "陈权业")
        (age 24)
        (friends (list "Jhon" "Jessica" "Ruby"))
        (relations
            (sobj
                (david "ok")
                (f #t)))
        (status 'yes)
        (a "b"))
`;
// 把上面的userSobj转成JavaScript的Object对象
console.log(toObj(userSobj));


// 把JavaScript的Object对象转换成SObj

let userObject = {
    name: "DavidChen",
    age: 24,
    status: "good",
    funny: ["yes", false, true, {ho: "yes", ho1: false}],
    shine: true,
    height: 167.3
};

// (sobj(name"DavidChen")(age 24)(status"good")(funny(list "yes" #f #t(sobj(ho"yes")(ho1 #f)))(shine #t)(height 167.3)
console.log(toSObj(userObject));

console.log(toObj(toSObj(userObject)));