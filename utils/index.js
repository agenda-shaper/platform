"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComError = exports.getTokenCount = exports.tokenEncode = exports.getRandomOne = exports.colorLabel = exports.encodeBase64 = exports.Lock = exports.maskLinks = exports.extractStrNumber = exports.randomUserAgent = exports.isSimilarity = exports.htmlToMarkdown = exports.getTokenSize = exports.OpenaiEventStream = exports.ThroughEventStream = exports.EventStream = exports.Event = exports.shuffleArray = exports.sleep = exports.encryptWithAes256Cbc = exports.parseJSON = exports.randomStr = exports.md5 = exports.toEventStream = exports.toEventCB = exports.TimeFormat = void 0;
var event_stream_1 = require("event-stream");
var stream_1 = require("stream");
var crypto = require("crypto");
var turndown_1 = require("turndown");
var string_similarity_1 = require("string-similarity");
//@ts-ignore
var user_agents_1 = require("user-agents");
var js_tiktoken_1 = require("js-tiktoken");
var chalk_1 = require("chalk");
var turndownService = new turndown_1.default({ codeBlockStyle: 'fenced' });
exports.TimeFormat = 'YYYY-MM-DD HH:mm:ss';
function toEventCB(arr, emit) {
    var pt = new stream_1.PassThrough();
    pt.write(arr);
    pt.pipe(event_stream_1.default.split(/\r?\n\r?\n/)) //split stream to break on newlines
        .pipe(event_stream_1.default.map(function (chunk, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, eventStr, dataStr, event, data;
            return __generator(this, function (_b) {
                _a = chunk.split(/\r?\n/), eventStr = _a[0], dataStr = _a[1];
                event = eventStr.replace(/event: /, '');
                data = dataStr.replace(/data: /, '');
                emit(event, data);
                cb(null, { data: data, event: event });
                return [2 /*return*/];
            });
        });
    }));
}
exports.toEventCB = toEventCB;
function toEventStream(arr) {
    var pt = new stream_1.PassThrough();
    pt.write(arr);
    return pt;
}
exports.toEventStream = toEventStream;
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
exports.md5 = md5;
var charactersForRandom = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomStr(length) {
    if (length === void 0) { length = 6; }
    var result = '';
    var charactersLength = charactersForRandom.length;
    for (var i = 0; i < length; i++) {
        result += charactersForRandom.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.randomStr = randomStr;
function parseJSON(str, defaultObj) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return defaultObj;
    }
}
exports.parseJSON = parseJSON;
function encryptWithAes256Cbc(data, key) {
    var hash = crypto.createHash('sha256').update(key).digest();
    var iv = crypto.randomBytes(16);
    var cipher = crypto.createCipheriv('aes-256-cbc', hash, iv);
    var encryptedData = cipher.update(data, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return iv.toString('hex') + encryptedData;
}
exports.encryptWithAes256Cbc = encryptWithAes256Cbc;
function sleep(duration) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () { return resolve(); }, duration);
                })];
        });
    });
}
exports.sleep = sleep;
function shuffleArray(array) {
    var _a;
    var shuffledArray = __spreadArray([], array, true);
    for (var i = shuffledArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [shuffledArray[j], shuffledArray[i]], shuffledArray[i] = _a[0], shuffledArray[j] = _a[1];
    }
    return shuffledArray;
}
exports.shuffleArray = shuffleArray;
var Event;
(function (Event) {
    Event["error"] = "error";
    Event["message"] = "message";
    Event["search"] = "search";
    Event["done"] = "done";
})(Event || (exports.Event = Event = {}));
var EventStream = /** @class */ (function () {
    function EventStream() {
        this.pt = new stream_1.PassThrough();
        this.pt.setEncoding('utf-8');
    }
    EventStream.prototype.write = function (event, data) {
        this.pt.write("event: ".concat(event, "\n"), 'utf-8');
        this.pt.write("data: ".concat(JSON.stringify(data), "\n\n"), 'utf-8');
    };
    EventStream.prototype.stream = function () {
        return this.pt;
    };
    EventStream.prototype.end = function (cb) {
        this.pt.end(cb);
    };
    EventStream.prototype.read = function (dataCB, closeCB) {
        var _this = this;
        this.pt.setEncoding('utf-8');
        this.pt.pipe(event_stream_1.default.split('\n\n')).pipe(event_stream_1.default.map(function (chunk, cb) { return __awaiter(_this, void 0, void 0, function () {
            var res, _a, eventStr, dataStr, event, data;
            return __generator(this, function (_b) {
                res = chunk.toString();
                if (!res) {
                    return [2 /*return*/];
                }
                _a = res.split('\n'), eventStr = _a[0], dataStr = _a[1];
                event = eventStr.replace('event: ', '');
                if (!(event in Event)) {
                    dataCB(Event.error, {
                        error: "EventStream data read failed, not support event ".concat(eventStr, ", ").concat(dataStr),
                    });
                    return [2 /*return*/];
                }
                data = parseJSON(dataStr.replace('data: ', ''), {});
                dataCB(event, data);
                return [2 /*return*/];
            });
        }); }));
        this.pt.on('close', closeCB);
    };
    return EventStream;
}());
exports.EventStream = EventStream;
var ThroughEventStream = /** @class */ (function (_super) {
    __extends(ThroughEventStream, _super);
    function ThroughEventStream(onData, onEnd) {
        var _this = _super.call(this) || this;
        _this.onData = onData;
        _this.onEnd = onEnd;
        return _this;
    }
    ThroughEventStream.prototype.destroy = function () {
        this.onData = undefined;
        this.onEnd = undefined;
    };
    ThroughEventStream.prototype.write = function (event, data) {
        var _a;
        (_a = this.onData) === null || _a === void 0 ? void 0 : _a.call(this, event, data);
    };
    ThroughEventStream.prototype.end = function () {
        var _a;
        (_a = this.onEnd) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    return ThroughEventStream;
}(EventStream));
exports.ThroughEventStream = ThroughEventStream;
var OpenaiEventStream = /** @class */ (function (_super) {
    __extends(OpenaiEventStream, _super);
    function OpenaiEventStream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'chatcmpl-' + randomStr() + randomStr();
        _this.start = false;
        return _this;
    }
    OpenaiEventStream.prototype.write = function (event, data) {
        if (!this.start) {
            this.pt.write("data: ".concat(JSON.stringify({
                id: this.id,
                object: 'chat.completion.chunk',
                choices: [{ index: 0, delta: { role: 'assistant', content: '' } }],
                finish_reason: null,
            }), "\n\n"), 'utf-8');
            this.start = true;
        }
        switch (event) {
            case Event.done:
                this.pt.write("data: ".concat(JSON.stringify({
                    id: this.id,
                    object: 'chat.completion.chunk',
                    choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
                    finish_reason: 'stop',
                }), "\n\n"), 'utf-8');
                this.pt.write("data: [DONE]\n\n", 'utf-8');
                break;
            case Event.search:
                this.pt.write("data: ".concat(JSON.stringify({
                    id: this.id,
                    object: 'chat.completion.chunk',
                    choices: [{ index: 0, delta: __assign({ content: '' }, data) }],
                    finish_reason: null,
                }), "\n\n"), 'utf-8');
                break;
            default:
                this.pt.write("data: ".concat(JSON.stringify({
                    id: this.id,
                    object: 'chat.completion.chunk',
                    choices: [{ index: 0, delta: data }],
                    finish_reason: null,
                }), "\n\n"), 'utf-8');
                break;
        }
    };
    OpenaiEventStream.prototype.read = function (dataCB, closeCB) {
        var _this = this;
        this.pt.setEncoding('utf-8');
        this.pt.pipe(event_stream_1.default.split(/\r?\n\r?\n/)).pipe(event_stream_1.default.map(function (chunk, cb) { return __awaiter(_this, void 0, void 0, function () {
            var dataStr, data, _a, _b, content, finish_reason;
            return __generator(this, function (_c) {
                dataStr = chunk.replace('data: ', '');
                if (!dataStr) {
                    return [2 /*return*/];
                }
                if (dataStr === '[DONE]') {
                    dataCB(Event.done, { content: '' });
                    return [2 /*return*/];
                }
                data = parseJSON(dataStr, {});
                if (!(data === null || data === void 0 ? void 0 : data.choices)) {
                    dataCB(Event.error, { error: "EventStream data read failed" });
                    return [2 /*return*/];
                }
                _a = data.choices[0], _b = _a.delta.content, content = _b === void 0 ? '' : _b, finish_reason = _a.finish_reason;
                dataCB(Event.message, { content: content });
                return [2 /*return*/];
            });
        }); }));
        this.pt.on('close', closeCB);
    };
    return OpenaiEventStream;
}(EventStream));
exports.OpenaiEventStream = OpenaiEventStream;
var getTokenSize = function (str) {
    return str.length;
};
exports.getTokenSize = getTokenSize;
var htmlToMarkdown = function (html) {
    return turndownService.turndown(html);
};
exports.htmlToMarkdown = htmlToMarkdown;
var isSimilarity = function (s1, s2) {
    var similarity = string_similarity_1.default.compareTwoStrings(s1, s2);
    return similarity > 0.3;
};
exports.isSimilarity = isSimilarity;
var randomUserAgent = function () {
    return new user_agents_1.default().toString();
};
exports.randomUserAgent = randomUserAgent;
function extractStrNumber(input) {
    // 使用正则表达式匹配所有的数字
    var matches = input.match(/\d+/g);
    if (matches) {
        // 将所有匹配的数字组合成一个新的字符串
        var numberString = matches.join('');
        // 将新的字符串转换为整数
        return parseInt(numberString);
    }
    // 如果输入的字符串中没有数字，返回0
    return 0;
}
exports.extractStrNumber = extractStrNumber;
function maskLinks(input) {
    // 定义一个正则表达式，用于匹配http或https的链接
    var linkRegex = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g;
    // 使用replace方法将所有的链接的http或https部分替换为"htxxp://"或"htxxps://"的字样
    var output = input.replace(linkRegex, function (match) {
        return match.replace(/http/g, 'htxxp');
    });
    return output;
}
exports.maskLinks = maskLinks;
var Lock = /** @class */ (function () {
    function Lock() {
        this.locked = false;
    }
    Lock.prototype.lock = function (timeout) {
        if (timeout === void 0) { timeout = 5 * 60 * 1000; }
        return __awaiter(this, void 0, void 0, function () {
            var timeoutPromise, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeoutPromise = new Promise(function (resolve, reject) {
                            _this.timeoutId = setTimeout(function () {
                                _this.locked = false;
                                reject(new Error('Lock timeout'));
                            }, timeout);
                        });
                        _a.label = 1;
                    case 1:
                        if (!this.locked) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, Promise.race([
                                new Promise(function (resolve) { return (_this.resolver = resolve); }),
                                timeoutPromise,
                            ])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        throw error_1;
                    case 5: return [3 /*break*/, 1];
                    case 6:
                        this.locked = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Lock.prototype.unlock = function () {
        if (!this.locked) {
            throw new Error('Cannot unlock a lock that is not locked');
        }
        this.locked = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = undefined;
        }
        if (this.resolver) {
            var resolve = this.resolver;
            this.resolver = undefined;
            resolve();
        }
    };
    return Lock;
}());
exports.Lock = Lock;
function encodeBase64(buffer, padded, urlSafe) {
    if (padded === void 0) { padded = false; }
    if (urlSafe === void 0) { urlSafe = true; }
    var base64 = buffer.toString('base64');
    if (!padded) {
        base64 = base64.replace(/=+$/, '');
    }
    if (urlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
    }
    return base64;
}
exports.encodeBase64 = encodeBase64;
function hashString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
function colorLabel(label) {
    var hash = hashString(label);
    var colors = [
        chalk_1.default.redBright,
        chalk_1.default.greenBright,
        chalk_1.default.yellowBright,
        chalk_1.default.blueBright,
        chalk_1.default.magentaBright,
        chalk_1.default.cyanBright,
        chalk_1.default.whiteBright,
        chalk_1.default.red,
        chalk_1.default.green,
        chalk_1.default.yellow,
        chalk_1.default.blue,
        chalk_1.default.magenta,
        chalk_1.default.cyan,
        chalk_1.default.white,
    ];
    var color = colors[hash % colors.length];
    if (typeof color !== 'function') {
        console.log(color);
    }
    return color(label);
}
exports.colorLabel = colorLabel;
function getRandomOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
exports.getRandomOne = getRandomOne;
var tokenizer = (0, js_tiktoken_1.getEncoding)('cl100k_base');
function tokenEncode(input) {
    return new Uint32Array(tokenizer.encode(input));
}
exports.tokenEncode = tokenEncode;
function getTokenCount(input) {
    return tokenEncode(input).length;
}
exports.getTokenCount = getTokenCount;
var ComError = /** @class */ (function (_super) {
    __extends(ComError, _super);
    function ComError(message, code) {
        if (code === void 0) { code = ComError.Status.InternalServerError; }
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, ComError.prototype);
        _this.name = _this.constructor.name; // 设置错误的名称为当前类名
        _this.status = code; // 设置错误代码
        return _this;
    }
    ComError.Status = {
        BadRequest: 400,
        Unauthorized: 401,
        Forbidden: 403,
        NotFound: 404,
        InternalServerError: 500,
        RequestTooLarge: 413,
        RequestTooMany: 429,
        Overload: 503,
    };
    return ComError;
}(Error));
exports.ComError = ComError;
