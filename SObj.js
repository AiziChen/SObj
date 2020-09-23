// export module SObj {
//     toObj;
// }
var OBJ_PREFIX = "(*obj";
var LIST_PREFIX = "(*list";
var BRACKET_START = "(";
var BRACKET_CLOSE = ")";
var SEPARATOR = " ";
var TYPE_TRUE = "#t";
var TYPE_FALSE = "#f";
var NULL = "()";
function isExp(str) {
    var prefixCount = 0;
    var suffixCount = 0;
    for (var i = 0; i < str.length; ++i) {
        if (str.charAt(i) == BRACKET_START) {
            prefixCount++;
        }
        else if (str.charAt(i) == BRACKET_CLOSE) {
            suffixCount++;
        }
    }
    return prefixCount == suffixCount;
}
function car(sexp) {
    var result = "";
    if (isExp(sexp)) {
        var len = sexp.length;
        var i = 1;
        var prefixCount = 0;
        var suffixCount = 0;
        if (i < len && sexp.charAt(i) == BRACKET_START) {
            for (i = 1; i < len; ++i) {
                var s = sexp.charAt(i);
                if (s == BRACKET_START) {
                    prefixCount++;
                }
                else if (s == BRACKET_CLOSE) {
                    suffixCount++;
                }
                if (s == BRACKET_CLOSE && prefixCount == suffixCount) {
                    result = result.concat(s);
                    break;
                }
                else {
                    result = result.concat(s);
                }
            }
        }
        else {
            for (i = 1; i < len; ++i) {
                var s = sexp.charAt(i);
                if (s == " " || s == BRACKET_START || s == BRACKET_CLOSE) {
                    break;
                }
                else {
                    result = result.concat(s);
                }
            }
        }
    }
    return result;
}
function cdr(sexp) {
    var result = sexp.substring(car(sexp).length + 1, sexp.length - 1) + BRACKET_CLOSE;
    if (result.startsWith(SEPARATOR)) {
        return BRACKET_START + result.substr(1);
    }
    else {
        return BRACKET_START + result;
    }
}
function addOneProperty(obj, property) {
    property = property.substring(1, property.length - 1);
    var ps = property.split(/\s+/g);
    var oName = ps[0];
    var oValue = ps[1];
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
function addSonObj(obj, sonObj, name) {
    obj[name] = sonObj;
}
function trimSObj(sobj) {
    var result = "";
    var len = sobj.length;
    var doubleQuoteCount = 0;
    for (var i = 0; i < len; ++i) {
        var s = sobj.charAt(i);
        if (s == " " || s == "\n" || s == "\t") {
            while (++i < len) {
                s = sobj.charAt(i);
                if (s == " " || s == "\n" || s == "\t") {
                    continue;
                }
                else {
                    if (s == '"') {
                        doubleQuoteCount++;
                    }
                    break;
                }
            }
            if (i < len) {
                var s2 = sobj.charAt(i);
                if (s2 != BRACKET_START) {
                    result = result.concat(SEPARATOR);
                }
            }
            else if (i == len) {
                return result;
            }
        }
        else if (s == '"') {
            doubleQuoteCount++;
            if (result.substring(result.length - 1) != SEPARATOR &&
                doubleQuoteCount % 2 != 0) {
                result = result.concat(SEPARATOR);
            }
        }
        result = result.concat(s);
    }
    return result;
}
function isStr(value) {
    return value.startsWith('"');
}
function isSymbol(sexp) {
    return sexp.startsWith("'");
}
function isBool(sexp) {
    return sexp == TYPE_FALSE || sexp == TYPE_TRUE;
}
function isNumber(value) {
    for (var i = 0; i < value.length; ++i) {
        var c = value.charCodeAt(i);
        if ((c < 48 && c != 46) || c > 57) {
            return false;
        }
    }
    return true;
}
function isObj(sexp) {
    return sexp.startsWith(OBJ_PREFIX);
}
function isList(sexp) {
    return sexp.startsWith(LIST_PREFIX);
}
function toStr(value) {
    return value.substring(1, value.length - 1);
}
function toNumber(value) {
    return Number.parseFloat(value);
}
function symbolToStr(value) {
    return value.substring(1);
}
function toBool(value) {
    if (value == TYPE_TRUE) {
        return true;
    }
    else if (value == TYPE_FALSE) {
        return false;
    }
}
function toList(sexp) {
    var result = [];
    while ((sexp = cdr(sexp)) != NULL) {
        var ele = car(sexp);
        if (isStr(ele)) {
            var tmp = toStr(ele);
            result.push(tmp);
        }
        else if (isNumber(ele)) {
            var tmp = toNumber(ele);
            result.push(tmp);
        }
        else if (isBool(ele)) {
            var tmp = toBool(ele);
            result.push(tmp);
        }
        else if (isSymbol(ele)) {
            var tmp = symbolToStr(ele);
            result.push(tmp);
        }
        else if (isObj(ele)) {
            var tmp = toObj(ele);
            result.push(tmp);
        }
        else if (isList(ele)) {
            var tmp = toList(ele);
            result.push(tmp);
        }
    }
    return result;
}
// export
function toObj(sobj) {
    var obj = {};
    sobj = trimSObj(sobj);
    if (!isObj(sobj)) {
        if (isList(sobj)) {
            return toList(sobj);
        }
        else {
            throw "Error: not a valid sobj syntax!";
        }
    }
    var slen = sobj.length;
    var start = sobj.indexOf(OBJ_PREFIX) + OBJ_PREFIX.length;
    var block = "";
    var prefixCount = 0;
    var suffixCount = 0;
    for (var i = start; i < slen; ++i) {
        var c = sobj.charAt(i);
        if (c != "\t" && c != "\n") {
            block = block.concat(c);
        }
        if (c == BRACKET_START) {
            prefixCount++;
        }
        else if (c == BRACKET_CLOSE) {
            suffixCount++;
            if (prefixCount == suffixCount) {
                // block over
                var name = car(block);
                var cadr = car(cdr(block));
                if (isObj(cadr)) {
                    var sonObj = toObj(cadr);
                    addSonObj(obj, sonObj, name);
                }
                else if (isList(cadr)) {
                    var list = toList(cadr);
                    obj[name] = list;
                }
                else {
                    addOneProperty(obj, block);
                }
                // clear this block
                block = "";
            }
        }
    }
    return obj;
}
function getSObjTypeValue(value) {
    var type = typeof value;
    if (type == "string") {
        return '"' + value + '"';
    }
    else if (Array.isArray(value)) {
        var result = BRACKET_START + SEPARATOR;
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var v = value_1[_i];
            result += getSObjTypeValue(v);
        }
        result += BRACKET_CLOSE;
        return result;
    }
    else if (type == "object") {
        return toSObj(value) + BRACKET_CLOSE;
    }
    else if (type == "boolean") {
        var result = value.toString() == "false"
            ? SEPARATOR + TYPE_FALSE
            : SEPARATOR + TYPE_TRUE;
        return result;
    }
    else if (type == "undefined") {
        throw "Error: `undefined` is not support to parse!";
    }
    else if (type == "number") {
        return value;
    }
    else {
        throw "Error: unreconized type `" + type + "`.";
    }
}
// export
function toSObj(obj) {
    var result = "";
    if (Array.isArray(obj)) {
        // is an array
        for (var i = 0; i < obj.length; ++i) {
            return (LIST_PREFIX + SEPARATOR + toSObj(obj[i]) + BRACKET_CLOSE + BRACKET_CLOSE);
        }
    }
    else {
        // is an object
        result = result.concat(OBJ_PREFIX);
        for (var key in obj) {
            var value = obj[key];
            var valueInSobj = "";
            var type = typeof value;
            if (type == "string") {
                valueInSobj = '"' + value + '"';
            }
            else if (Array.isArray(value)) {
                valueInSobj += LIST_PREFIX + SEPARATOR;
                for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                    var v = value_2[_i];
                    valueInSobj += getSObjTypeValue(v);
                }
                valueInSobj += BRACKET_CLOSE;
            }
            else if (type == "object") {
                valueInSobj += toSObj(value);
                valueInSobj += BRACKET_CLOSE;
            }
            else if (type == "boolean") {
                valueInSobj += value == false ? " #f" : " #t";
            }
            else if (type == "undefined") {
                throw "Error: `undefined` is not support to parse!";
            }
            else if (type == "number") {
                valueInSobj = " " + value;
            }
            else {
                throw "Error: unreconized type `" + type + "`.";
            }
            result = result.concat(BRACKET_START + key + valueInSobj + BRACKET_CLOSE);
        }
    }
    return result;
}
