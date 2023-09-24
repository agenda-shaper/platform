"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.sliceMessagesByLength = exports.sliceMessagesByToken = exports.messagesToPrompt = exports.Site = exports.ModelType = void 0;
var utils_1 = require("../utils");
var log_1 = require("../utils/log");
var ModelType;
(function (ModelType) {
    ModelType["GPT3p5Turbo"] = "gpt-3.5-turbo";
    ModelType["GPT3p5TurboHaining"] = "gpt-3.5-turbo-haining";
    ModelType["GPT3p5_16k"] = "gpt-3.5-turbo-16k";
    ModelType["GPT4"] = "gpt-4";
    ModelType["GPT4_32k"] = "gpt-4-32k";
    ModelType["NetGPT4"] = "net-gpt-4";
    ModelType["Sage"] = "sage";
    ModelType["NetGpt3p5"] = "net-gpt-3.5-turbo";
    ModelType["ClaudeInstance"] = "claude-instance";
    ModelType["Claude"] = "claude";
    ModelType["Claude100k"] = "claude-100k";
    ModelType["Claude2_100k"] = "claude-2-100k";
    ModelType["Gpt4free"] = "gpt-4-free";
    ModelType["GooglePalm"] = "google-palm";
    ModelType["Llama_2_70b"] = "llama-2-70b";
    ModelType["Llama_2_13b"] = "llama-2-13b";
    ModelType["Llama_2_7b"] = "llama-2-7b";
    ModelType["Code_Llama_34b"] = "code-llama-34b";
    ModelType["Code_Llama_13b"] = "code-llama-13b";
    ModelType["Code_Llama_7b"] = "code-llama-7b";
    ModelType["Search"] = "search";
    ModelType["URL"] = "url";
})(ModelType || (exports.ModelType = ModelType = {}));
var Site;
(function (Site) {
    // define new model here
    Site["You"] = "you";
    Site["Phind"] = "phind";
    Site["Forefront"] = "forefront";
    Site["Mcbbs"] = "mcbbs";
    Site["ChatDemo"] = "chatdemo";
    Site["Vita"] = "vita";
    Site["Skailar"] = "skailar";
    Site["FakeOpen"] = "fakeopen";
    Site["EasyChat"] = "easychat";
    Site["Better"] = "better";
    Site["PWeb"] = "pweb";
    Site["Bai"] = "bai";
    Site["Gra"] = "gra";
    Site["Magic"] = "magic";
    Site["Chim"] = "chim";
    Site["Ram"] = "ram";
    Site["Chur"] = "chur";
    Site["Xun"] = "xun";
    Site["VVM"] = "vvm";
    Site["Poef"] = "poef";
    Site["Claude"] = "claude";
    Site["Cursor"] = "cursor";
    Site["Auto"] = "auto";
    Site["ChatBase"] = "chatbase";
    Site["AiLs"] = "ails";
    Site["SinCode"] = "sincode";
    Site["OpenAI"] = "openai";
    Site["OneAPI"] = "oneapi";
    Site["Jasper"] = "jasper";
    Site["Pap"] = "pap";
    Site["AcyToo"] = "acytoo";
    Site["Google"] = "google";
    Site["WWW"] = "www";
    Site["DDG"] = "ddg";
})(Site || (exports.Site = Site = {}));
// 结构体message转换为prompt
function messagesToPrompt(messages) {
    if (messages.length === 1) {
        return messages[0].content;
    }
    return (messages.map(function (item) { return "".concat(item.role, ": ").concat(item.content); }).join('\n') +
        '\n' +
        'assistant: ');
}
exports.messagesToPrompt = messagesToPrompt;
function sliceMessagesByToken(messages, limitSize, countPrompt) {
    if (countPrompt === void 0) { countPrompt = false; }
    var size = (0, utils_1.getTokenCount)(countPrompt
        ? messagesToPrompt(messages)
        : messages.reduce(function (prev, cur) { return prev + cur.content; }, ''));
    console.log("".concat(countPrompt ? 'prompt' : 'messages.content', " token count ").concat(size, " / ").concat(limitSize));
    if (size < limitSize) {
        return messages;
    }
    var newMessage = messages.slice(1, messages.length);
    if (newMessage.length === 0) {
        throw new utils_1.ComError('message too long', utils_1.ComError.Status.RequestTooLarge);
    }
    return sliceMessagesByToken(newMessage, limitSize);
}
exports.sliceMessagesByToken = sliceMessagesByToken;
function sliceMessagesByLength(messages, limitSize, countPrompt) {
    if (countPrompt === void 0) { countPrompt = false; }
    var size = (countPrompt
        ? messagesToPrompt(messages)
        : messages.reduce(function (prev, cur) { return prev + cur.content; }, '')).length;
    console.log("".concat(countPrompt ? 'prompt' : 'messages.content', " length ").concat(size, " / ").concat(limitSize));
    if (size < limitSize) {
        return messages;
    }
    var newMessage = messages.slice(1, messages.length);
    if (newMessage.length === 0) {
        throw new utils_1.ComError('message too long', utils_1.ComError.Status.RequestTooLarge);
    }
    return sliceMessagesByLength(newMessage, limitSize);
}
exports.sliceMessagesByLength = sliceMessagesByLength;
var Chat = /** @class */ (function () {
    function Chat(options) {
        this.options = options;
        this.logger = (0, log_1.newLogger)(options === null || options === void 0 ? void 0 : options.name);
    }
    Chat.prototype.support = function (model) {
        throw new utils_1.ComError('not implement', utils_1.ComError.Status.InternalServerError);
    };
    Chat.prototype.preHandle = function (req, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, token, _c, countPrompt, size;
            return __generator(this, function (_d) {
                _a = options || {}, _b = _a.token, token = _b === void 0 ? false : _b, _c = _a.countPrompt, countPrompt = _c === void 0 ? true : _c;
                size = this.support(req.model);
                if (!size) {
                    throw new utils_1.ComError("not support model: ".concat(req.model), utils_1.ComError.Status.NotFound);
                }
                req.messages = token
                    ? sliceMessagesByToken(req.messages, size, countPrompt)
                    : sliceMessagesByLength(req.messages, size, countPrompt);
                req.prompt = messagesToPrompt(req.messages);
                return [2 /*return*/, req];
            });
        });
    };
    Chat.prototype.ask = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var stream, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stream = new utils_1.EventStream();
                        return [4 /*yield*/, this.askStream(req, stream)];
                    case 1:
                        _a.sent();
                        result = {
                            content: '',
                        };
                        return [2 /*return*/, new Promise(function (resolve) {
                                stream.read(function (event, data) {
                                    switch (event) {
                                        case utils_1.Event.done:
                                            break;
                                        case utils_1.Event.message:
                                            result.content += data.content || '';
                                            break;
                                        case utils_1.Event.error:
                                            result.error = data.error;
                                            break;
                                    }
                                }, function () {
                                    resolve(result);
                                });
                            })];
                }
            });
        });
    };
    Chat.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new utils_1.ComError('not implement', utils_1.ComError.Status.InternalServerError);
            });
        });
    };
    return Chat;
}());
exports.Chat = Chat;
