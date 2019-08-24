// export module SObj {
//     toObj;
// }

const OBJ_PREFIX = "(sobj";
const LIST_PREFIX = "(list";
const PREFIX = "(";
const SUFFIX = ")";

function isExp(str : string) : boolean {
    let prefixCount = 0;
    let suffixCount = 0;
    for (let i = 0; i < str.length; ++i) {
        if (str.charAt(i) == PREFIX) {
            prefixCount++;
        } else if (str.charAt(i) == SUFFIX) {
            suffixCount++;
        }
    }
    return prefixCount == suffixCount;
}

function car(sexp : string) : string {
    let result = "";
    if (isExp(sexp)) {
        let len = sexp.length;
        let i = 1;
        let prefixCount = 0;
        let suffixCount = 0;
        if (i < len && sexp.charAt(i) == PREFIX) {
            for (i = 1; i < len; ++i) {
                let s = sexp.charAt(i);
                if (s == PREFIX) {
                    prefixCount++;
                } else if (s == SUFFIX) {
                    suffixCount++;
                }
                if (s == SUFFIX && prefixCount == suffixCount) {
                    result = result.concat(s);
                    break;
                } else {
                    result = result.concat(s);
                }
            }
        } else {
            for (i = 1; i < len; ++i) {
                let s = sexp.charAt(i);
                if (s == " " || s == PREFIX || s == SUFFIX) {
                    break;
                } else {
                    result = result.concat(s);
                }
            }
        }
    }
    return result;
}

function cdr(sexp : string) : string {
    let result = sexp.substring(car(sexp).length + 1, sexp.length-1) + SUFFIX
    if (result.startsWith(" ")) {
        return PREFIX + result.substr(1);
    } else {
        return PREFIX + result;
    }
}


function addOneProperty(obj : object, property : string) : void {
    property = property.substring(1, property.length-1);
    let ps = property.split(/\s+/g);
    let oName = ps[0];
    let oValue = ps[1];
    // string
    if (isStr(oValue)) {
        obj[oName] = toStr(oValue);
    }
    // number
    else if (isNumber(oValue)) {
        obj[oName] = toNumber(oValue);
    }
    // boolean
    else if (isBool(oValue)) {
        obj[oName] = toBool(oValue);
    }
    // symbol
    else if (isSymbol(oValue)) {
        obj[oName] = symbolToStr(oValue);
    }
}

function addSonObj(obj : object, sonObj : object, name : string) : void {
    obj[name] = sonObj;
}


function trimSObj(sobj : string) : string {
    let result = "";
    let len = sobj.length;
    let doubleQuoteCount = 0;
    for (let i = 0; i < len; ++i) {
        let s = sobj.charAt(i);
        if (s == " " || s == "\n" || s == "\t") {
            while (++i < len) {
                s = sobj.charAt(i);
                if (s == " " || s == "\n" || s == "\t") {
                    continue;
                } else {
                    if (s == "\"") {
                        doubleQuoteCount++;
                    }
                    break;
                }
            }
            if (i < len) {
                let s2 = sobj.charAt(i);
                if (s2 != PREFIX) {
                    result = result.concat(" ");
                }
            } else if (i == len) {
                return result;
            }
        } else if (s == "\"") {
            doubleQuoteCount++;
            if (result.substring(result.length - 1) != " " &&
                doubleQuoteCount % 2 != 0) {
                result = result.concat(" ");
            }
        }
        result = result.concat(s);
    }
    return result;
}


function isStr(value : string) : boolean {
    return value.startsWith("\"");
}

function isSymbol(sexp : string) : boolean {
    return sexp.startsWith("\'");
}

function isBool(sexp : string) : boolean {
    return sexp == "#f" || sexp == "#t";
}

function isNumber(value : string) : boolean {
    for (let i = 0; i < value.length; ++i) {
        let c = value.charCodeAt(i);
        if ((c < 48 && c != 46) || c > 57) {
            return false;
        }
    }
    return true;
}

function isObj(sexp : string) : boolean {
    return sexp.startsWith(OBJ_PREFIX);
}

function isList(sexp : string) : boolean {
    return sexp.startsWith(LIST_PREFIX);
}

function toStr(value : string) : string {
    return value.substring(1, value.length-1);
}

function toNumber(value : string) : number {
    return Number.parseFloat(value);
}

function symbolToStr(value : string) : string {
    return value.substring(1);
}

function toBool(value : string) : boolean {
    if (value == "#t") {
        return true;
    } else if (value == "#f") {
        return false;
    }
}

function toList(sexp : string) : Array<any> {
    let result = [];
    while ((sexp = cdr(sexp)) != "()") {
        let ele : string = car(sexp);
        if (isStr(ele)) {
            let tmp = toStr(ele);
            result.push(tmp);
        } else if (isNumber(ele)) {
            let tmp = toNumber(ele);
            result.push(tmp);
        } else if (isBool(ele)) {
            let tmp = toBool(ele);
            result.push(tmp);
        } else if (isSymbol(ele)) {
            let tmp = symbolToStr(ele);
            result.push(tmp);
        } else if (isObj(ele)) {
            let tmp = toObj(ele);
            result.push(tmp);
        } else if (isList(ele)) {
            let tmp = toList(ele);
            result.push(tmp);
        }
    }
    return result;
}

// export
function toObj(sobj : string) : object {
    let obj : object = {};
    sobj = trimSObj(sobj);
    if (!isObj(sobj)) {
        if (isList(sobj)) {
            return toList(sobj);
        } else {
            throw "Error: not a valid sobj syntax!";   
        }
    }
    let slen = sobj.length;
    let start = sobj.indexOf(OBJ_PREFIX) + OBJ_PREFIX.length;
    let block : string = "";
    let prefixCount = 0;
    let suffixCount = 0;
    for (let i = start; i < slen; ++i) {
        let c = sobj.charAt(i);
        if (c != "\t" && c != "\n") {
            block = block.concat(c);
        }
        if (c == PREFIX) {
            prefixCount++;
        } else if (c == SUFFIX) {
            suffixCount++;
            if (prefixCount == suffixCount) {
                // block over
                let name = car(block);
                let cadr = car(cdr(block));
                if (isObj(cadr)) {
                    let sonObj = toObj(cadr);
                    addSonObj(obj, sonObj, name);
                } else if (isList(cadr)) {
                    let list = toList(cadr);
                    obj[name] = list;
                } else {
                    addOneProperty(obj, block);
                }
                // clear this block
                block = "";
            }
        }
    }
    return obj;
}


function getSObjTypeValue(value : object) : any {
    let type = typeof(value);
    if (type == "string") {
        return "\"" + value + "\"";
    } else if (Array.isArray(value)) {
        let result = "(list ";
        for (let v of value) {
            result += getSObjTypeValue(v);
        }
        result += ")";
        return result;
    } else if (type == "object") {
        return toSObj(value) + ")";
    } else if (type == "boolean") {
        let result = value.toString() == "false" ? " #f" : " #t";
        return result;
    } else if (type == "undefined") {
        throw "Error: `undefined` is not support to parse!";
    } else if (type == "number") {
        return value;
    } else {
        throw "Error: unreconized type `" + type + "`.";
    }
}

// export
function toSObj(obj : object) : string {
    let result : string = "";

    if (Array.isArray(obj)) {
        // is an array
        for (let i = 0; i < obj.length; ++i) {
            return "(list " + toSObj(obj[i]) + "))";
        }
    } else {
        // is an object
        result = result.concat("(sobj");
        for (let key in obj) {
            let value = obj[key];
            let valueInSobj = "";
            let type = typeof(value);
            if (type == "string") {
                valueInSobj = "\"" + value + "\"";
            } else if (Array.isArray(value)) {
                valueInSobj += "(list ";
                for (let v of value) {
                    valueInSobj += getSObjTypeValue(v);
                }
                valueInSobj += ")";
            } else if (type == "object") {
                valueInSobj += toSObj(value);
                valueInSobj += ")";
            } else if (type == "boolean") {
                valueInSobj += value == false ? " #f" : " #t";
            } else if (type == "undefined") {
                throw "Error: `undefined` is not support to parse!";
            } else if (type == "number") {
                valueInSobj = " " + value;
            } else {
                throw "Error: unreconized type `" + type + "`.";
            }
            result = result.concat("(" + key + valueInSobj + ")");
        }
    }

    return result;
}
