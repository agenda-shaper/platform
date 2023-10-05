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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmailPro = exports.CreateEmail = exports.TempEmailType = void 0;
var index_1 = require("./index");
var proxyAgent_1 = require("./proxyAgent");
var TempEmailType;
(function (TempEmailType) {
    // need credit card https://rapidapi.com/Privatix/api/temp-mail
    TempEmailType["TempEmail"] = "temp-email";
    // not need credit card , hard limit 100/day https://rapidapi.com/calvinloveland335703-0p6BxLYIH8f/api/temp-mail44
    TempEmailType["TempEmail44"] = "temp-email44";
    // not need credit card and not need credit rapid_api_key
    TempEmailType["TempMailLOL"] = "tempmail-lol";
    TempEmailType["Inbox"] = "inbox";
    TempEmailType["Internal"] = "internal";
    TempEmailType["SmailPro"] = "smail-pro";
    TempEmailType["Gmail"] = "gmail";
})(TempEmailType || (exports.TempEmailType = TempEmailType = {}));
var gmailLock = new index_1.Lock();
var smailProLock = new index_1.Lock();
function CreateEmail(tempMailType, options) {
    switch (tempMailType) {
        case TempEmailType.TempEmail44:
            return new TempMail44(options);
        case TempEmailType.TempEmail:
            return new TempMail(options);
        case TempEmailType.TempMailLOL:
            return new TempMailLOL(options);
        case TempEmailType.Inbox:
            return new Inbox(options);
        case TempEmailType.Internal:
            return new Internal(options);
        case TempEmailType.SmailPro:
            return new SmailPro(__assign(__assign({}, options), { lock: smailProLock }));
        case TempEmailType.Gmail:
            return new Gmail(__assign(__assign({}, options), { lock: gmailLock }));
        default:
            throw new Error('not support TempEmailType');
    }
}
exports.CreateEmail = CreateEmail;
var BaseEmail = /** @class */ (function () {
    function BaseEmail(options) {
    }
    return BaseEmail;
}());
var Inbox = /** @class */ (function (_super) {
    __extends(Inbox, _super);
    function Inbox(options) {
        var _this = _super.call(this, options) || this;
        var apikey = (options === null || options === void 0 ? void 0 : options.apikey) || process.env.rapid_api_key;
        if (!apikey) {
            throw new Error('Need apikey for TempMail');
        }
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://inboxes-com.p.rapidapi.com',
            headers: {
                'X-RapidAPI-Key': apikey,
                'X-RapidAPI-Host': 'inboxes-com.p.rapidapi.com',
            },
        }, false);
        return _this;
    }
    Inbox.prototype.getMailAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, res;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this;
                        _c = (_b = "".concat((0, index_1.randomStr)(), "@")).concat;
                        return [4 /*yield*/, this.randomDomain()];
                    case 1:
                        _a.address = _c.apply(_b, [_d.sent()]);
                        return [4 /*yield*/, this.client.post("inboxes/".concat(this.address))];
                    case 2:
                        res = _d.sent();
                        console.log(res.data);
                        return [2 /*return*/, this.address];
                }
            });
        });
    };
    Inbox.prototype.waitMails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var time = 0;
                        var itl = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.client.get("inboxes/".concat(this.address))];
                                    case 1:
                                        response = _a.sent();
                                        if (response.data && response.data.length > 0) {
                                            resolve(response.data.map(function (item) { return (__assign(__assign({}, item), { content: item.mail_html })); }));
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        if (time > 5) {
                                            resolve([]);
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        time++;
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 10000);
                    })];
            });
        });
    };
    Inbox.prototype.getDomainsList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/domains")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data.map(function (item) { return item.qdn; })];
                }
            });
        });
    };
    Inbox.prototype.randomDomain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var domainList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDomainsList()];
                    case 1:
                        domainList = _a.sent();
                        return [2 /*return*/, domainList[Math.floor(Math.random() * domainList.length)]];
                }
            });
        });
    };
    return Inbox;
}(BaseEmail));
var TempMail = /** @class */ (function (_super) {
    __extends(TempMail, _super);
    function TempMail(options) {
        var _this = _super.call(this, options) || this;
        _this.mailID = '';
        var apikey = (options === null || options === void 0 ? void 0 : options.apikey) || process.env.rapid_api_key;
        if (!apikey) {
            throw new Error('Need apikey for TempMail');
        }
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://privatix-temp-mail-v1.p.rapidapi.com/request/',
            headers: {
                'X-RapidAPI-Key': apikey,
                'X-RapidAPI-Host': 'privatix-temp-mail-v1.p.rapidapi.com',
            },
        });
        return _this;
    }
    TempMail.prototype.getMailAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this;
                        _c = (_b = "".concat((0, index_1.randomStr)())).concat;
                        return [4 /*yield*/, this.randomDomain()];
                    case 1:
                        _a.address = _c.apply(_b, [_d.sent()]);
                        this.mailID = (0, index_1.md5)(this.address);
                        return [2 /*return*/, this.address];
                }
            });
        });
    };
    TempMail.prototype.waitMails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mailID;
            var _this = this;
            return __generator(this, function (_a) {
                mailID = this.mailID;
                return [2 /*return*/, new Promise(function (resolve) {
                        var time = 0;
                        var itl = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.client.get("/mail/id/".concat(mailID))];
                                    case 1:
                                        response = _a.sent();
                                        if (response.data && response.data.length > 0) {
                                            resolve(response.data.map(function (item) { return (__assign(__assign({}, item), { content: item.mail_html })); }));
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        if (time > 5) {
                                            resolve([]);
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        time++;
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 10000);
                    })];
            });
        });
    };
    TempMail.prototype.getDomainsList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get("/domains/")];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                }
            });
        });
    };
    TempMail.prototype.randomDomain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var domainList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDomainsList()];
                    case 1:
                        domainList = _a.sent();
                        return [2 /*return*/, domainList[Math.floor(Math.random() * domainList.length)]];
                }
            });
        });
    };
    return TempMail;
}(BaseEmail));
var TempMail44 = /** @class */ (function (_super) {
    __extends(TempMail44, _super);
    function TempMail44(options) {
        var _this = _super.call(this, options) || this;
        _this.address = '';
        var apikey = (options === null || options === void 0 ? void 0 : options.apikey) || process.env.rapid_api_key;
        if (!apikey) {
            throw new Error('Need apikey for TempMail');
        }
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://temp-mail44.p.rapidapi.com/api/v3/email/',
            headers: {
                'X-RapidAPI-Key': apikey,
                'X-RapidAPI-Host': 'temp-mail44.p.rapidapi.com',
            },
        }, false);
        return _this;
    }
    TempMail44.prototype.getMailAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.post('/new', {}, {
                            headers: {
                                'content-type': 'application/json',
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        this.address = response.data.email;
                        return [2 /*return*/, this.address];
                }
            });
        });
    };
    TempMail44.prototype.waitMails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var time = 0;
                        var itl = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.client.get("/".concat(this.address, "/messages"))];
                                    case 1:
                                        response = _a.sent();
                                        if (response.data && response.data.length > 0) {
                                            resolve(response.data.map(function (item) { return (__assign(__assign({}, item), { content: item.body_html })); }));
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        if (time > 5) {
                                            resolve([]);
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        time++;
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 10000);
                    })];
            });
        });
    };
    return TempMail44;
}(BaseEmail));
var TempMailLOL = /** @class */ (function (_super) {
    __extends(TempMailLOL, _super);
    function TempMailLOL(options) {
        var _this = _super.call(this, options) || this;
        _this.address = '';
        _this.token = '';
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://api.tempmail.lol',
        });
        return _this;
    }
    TempMailLOL.prototype.getMailAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.get('/generate')];
                    case 1:
                        response = _a.sent();
                        this.address = response.data.address;
                        this.token = response.data.token;
                        return [2 /*return*/, this.address];
                }
            });
        });
    };
    TempMailLOL.prototype.waitMails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var time = 0;
                        var itl = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.client.get("/auth/".concat(this.token))];
                                    case 1:
                                        response = _a.sent();
                                        if (response.data && response.data.email.length > 0) {
                                            resolve(response.data.email.map(function (item) { return (__assign(__assign({}, item), { content: item.html })); }));
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        if (time > 5) {
                                            resolve([]);
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        time++;
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 10000);
                    })];
            });
        });
    };
    return TempMailLOL;
}(BaseEmail));
var Internal = /** @class */ (function (_super) {
    __extends(Internal, _super);
    function Internal(options) {
        var _this = _super.call(this, options) || this;
        _this.apiUrl = 'https://api.internal.temp-mail.io/api/v3';
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://api.internal.temp-mail.io/api/v3',
        });
        return _this;
    }
    Internal.prototype.getMailAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var length, characters, address, i, data, response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        length = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
                        characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                        address = '';
                        for (i = 0; i < length; i++) {
                            address += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                        data = {
                            name: address,
                            domain: 'gixenmixen.com',
                        };
                        return [4 /*yield*/, this.client.post('/email/new', data)];
                    case 1:
                        response = _a.sent();
                        result = response.data;
                        console.log(data);
                        console.log(result);
                        return [2 /*return*/, result.email];
                }
            });
        });
    };
    Internal.prototype.waitMails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mailAddress, times, response, data, mail, content, parser, htmlDoc, codeDiv, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMailAddress()];
                    case 1:
                        mailAddress = _a.sent();
                        times = 0;
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.client.get("/email/".concat(mailAddress, "/messages"))];
                    case 3:
                        response = _a.sent();
                        console.log("\u6B63\u5728\u83B7\u53D6\u90AE\u4EF6\uFF1A".concat(times));
                        if (response.status === 200) {
                            data = response.data;
                            if (data.length > 0) {
                                try {
                                    mail = data[0];
                                    content = mail.body_html;
                                    parser = new DOMParser();
                                    htmlDoc = parser.parseFromString(content, 'text/html');
                                    codeDiv = htmlDoc.querySelector("div[style='font-family:system-ui, Segoe UI, sans-serif;font-size:19px;font-weight:700;line-height:1.6;text-align:center;color:#333333;']");
                                    code = (codeDiv === null || codeDiv === void 0 ? void 0 : codeDiv.textContent) || '';
                                    return [2 /*return*/, [{ content: code }]];
                                }
                                catch (error) {
                                    console.log('error');
                                }
                                return [3 /*break*/, 5];
                            }
                        }
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                    case 4:
                        _a.sent();
                        times++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, []];
                }
            });
        });
    };
    return Internal;
}(BaseEmail));
var SmailPro = /** @class */ (function (_super) {
    __extends(SmailPro, _super);
    function SmailPro(options) {
        var _this = _super.call(this, options) || this;
        _this.lock = options.lock;
        return _this;
    }
    SmailPro.prototype.getMailAddress = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, page, times, email, e_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.lock.lock(120 * 1000)];
                    case 1:
                        _d.sent();
                        if (!!this.page) return [3 /*break*/, 3];
                        _c = this;
                        return [4 /*yield*/, (0, proxyAgent_1.CreateNewPage)('http://smailpro.com/advanced')];
                    case 2:
                        _c.page = _d.sent();
                        setTimeout(function () {
                            var _a;
                            (_a = _this.page) === null || _a === void 0 ? void 0 : _a.browser().close();
                        }, 360 * 1000);
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 20, , 21]);
                        page = this.page;
                        return [4 /*yield*/, page.waitForSelector('.grid > .md\\:rounded-md > .absolute:nth-child(2) > .w-6 > path')];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, page.click('.grid > .md\\:rounded-md > .absolute:nth-child(2) > .w-6 > path')];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('.relative > .absolute > .text-gray-500 > .h-6 > path')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, page.click('.relative > .absolute > .text-gray-500 > .h-6 > path')];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, (0, index_1.sleep)(1000)];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('#autosuggest__input', { visible: true })];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, page.click('#autosuggest__input')];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, page.keyboard.type('random@gmail.com', {
                                delay: 40,
                            })];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, (0, index_1.sleep)(1000)];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, page.keyboard.press('Enter')];
                    case 13:
                        _d.sent();
                        console.log('generating email');
                        times = 0;
                        _d.label = 14;
                    case 14:
                        if (!true) return [3 /*break*/, 19];
                        times += 1;
                        return [4 /*yield*/, page.waitForSelector('#my-email')];
                    case 15:
                        _d.sent();
                        return [4 /*yield*/, page.evaluate(function () { var _a; return ((_a = document.querySelector('#my-email')) === null || _a === void 0 ? void 0 : _a.textContent) || ''; })];
                    case 16:
                        email = _d.sent();
                        if (!(email === '...')) return [3 /*break*/, 18];
                        if (times > 5) {
                            throw new Error('get mail failed, max retry times!');
                        }
                        return [4 /*yield*/, (0, index_1.sleep)(5 * 1000)];
                    case 17:
                        _d.sent();
                        return [3 /*break*/, 14];
                    case 18: return [2 /*return*/, email + '@gmail.com'];
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        e_1 = _d.sent();
                        console.log('get mail failed, err:', e_1);
                        (_b = (_a = this.page).browser) === null || _b === void 0 ? void 0 : _b.call(_a).close();
                        this.lock.unlock();
                        throw e_1;
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    SmailPro.prototype.waitMails = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var page, times, content, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        page = this.page;
                        if (!page) {
                            return [2 /*return*/, []];
                        }
                        times = 0;
                        _c.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 17];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 12, 15, 16]);
                        return [4 /*yield*/, page.waitForSelector('.flex-auto > .flex > .inline-flex > .order-last > .h-6', { timeout: 5 * 1000 })];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.click('.flex-auto > .flex > .inline-flex > .order-last > .h-6')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, page.waitForSelector('.flex-auto > .flex > .py-2 > .scrollbar > .px-2', { timeout: 5 * 1000 })];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, page.click('.flex-auto > .flex > .py-2 > .scrollbar > .px-2')];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, page.waitForSelector('.flex > div > div > .mt-2 > .w-full', {
                                timeout: 5 * 1000,
                            })];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a;
                                return (
                                //@ts-ignore
                                // prettier-ignore
                                ((_a = document.querySelector('.flex > div > div > .mt-2 > .w-full')) === null || _a === void 0 ? void 0 : _a.contentDocument.documentElement.outerHTML) || '');
                            })];
                    case 8:
                        content = _c.sent();
                        if (!content) return [3 /*break*/, 10];
                        return [4 /*yield*/, ((_a = this.page) === null || _a === void 0 ? void 0 : _a.browser().close())];
                    case 9:
                        _c.sent();
                        this.lock.unlock();
                        return [2 /*return*/, [{ content: content }]];
                    case 10: return [4 /*yield*/, (0, index_1.sleep)(5 * 1000)];
                    case 11:
                        _c.sent();
                        return [3 /*break*/, 16];
                    case 12:
                        e_2 = _c.sent();
                        if (!(times >= 6)) return [3 /*break*/, 14];
                        this.lock.unlock();
                        return [4 /*yield*/, ((_b = this.page) === null || _b === void 0 ? void 0 : _b.browser().close())];
                    case 13:
                        _c.sent();
                        throw new Error('got mails failed');
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        times += 1;
                        return [7 /*endfinally*/];
                    case 16: return [3 /*break*/, 1];
                    case 17: return [2 /*return*/, []];
                }
            });
        });
    };
    return SmailPro;
}(BaseEmail));
exports.SmailPro = SmailPro;
var Gmail = /** @class */ (function (_super) {
    __extends(Gmail, _super);
    function Gmail(options) {
        var _this = _super.call(this, options) || this;
        _this.address = '';
        _this.timestamp = 0;
        var apikey = process.env.rapid_api_key || '';
        _this.lock = options.lock;
        if (!apikey) {
            throw new Error('Need apikey for TempMail');
        }
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://temp-gmail.p.rapidapi.com',
            headers: {
                'X-RapidAPI-Key': apikey,
                'X-RapidAPI-Host': 'temp-gmail.p.rapidapi.com',
            },
        }, false);
        return _this;
    }
    Gmail.prototype.getMailAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lock.lock(60 * 1000)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.get('/get', {
                                params: {
                                    domain: 'googlemail.com',
                                    username: 'random',
                                    server: 'server-2',
                                    type: 'real',
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        this.address = response.data.items.email;
                        this.timestamp = response.data.items.timestamp;
                        return [2 /*return*/, this.address];
                }
            });
        });
    };
    Gmail.prototype.check = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var checkres, mid, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.get("/check", {
                                params: {
                                    email: this.address,
                                    timestamp: "".concat(this.timestamp),
                                },
                            })];
                    case 1:
                        checkres = _b.sent();
                        mid = (_a = checkres.data.items[0]) === null || _a === void 0 ? void 0 : _a.mid;
                        return [2 /*return*/, [checkres.data.msg === 'ok', mid || '']];
                    case 2:
                        e_3 = _b.sent();
                        console.log('check email failed, err = ', e_3.message);
                        return [2 /*return*/, [false, '']];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Gmail.prototype.waitMails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var time = 0;
                        var itl = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, ok, mid, response, item, e_4;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, this.check()];
                                    case 1:
                                        _a = _b.sent(), ok = _a[0], mid = _a[1];
                                        if (!mid) {
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, this.client.get("/read", {
                                                params: { email: this.address, message_id: mid },
                                            })];
                                    case 2:
                                        response = _b.sent();
                                        if (response.data && response.data.items) {
                                            item = response.data.items;
                                            resolve([__assign(__assign({}, item), { content: item.body })]);
                                            this.lock.unlock();
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        if (time > 5) {
                                            resolve([]);
                                            this.lock.unlock();
                                            clearInterval(itl);
                                            return [2 /*return*/];
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_4 = _b.sent();
                                        console.error(e_4.message);
                                        return [3 /*break*/, 4];
                                    case 4:
                                        time++;
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 20 * 1000);
                    })];
            });
        });
    };
    return Gmail;
}(BaseEmail));
