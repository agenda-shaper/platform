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
exports.Claude = void 0;
var base_1 = require("../base");
var puppeteer_1 = require("../../utils/puppeteer");
var emailFactory_1 = require("../../utils/emailFactory");
var fs = require("fs");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var moment_1 = require("moment");
var event_stream_1 = require("event-stream");
var proxyAgent_1 = require("../../utils/proxyAgent");
var TimeFormat = 'YYYY-MM-DD HH:mm:ss';
var ClaudeAccountPool = /** @class */ (function () {
    function ClaudeAccountPool() {
        this.pool = [];
        this.account_file_path = './run/account_claude.json';
        this.using = new Set();
        if (fs.existsSync(this.account_file_path)) {
            var accountStr = fs.readFileSync(this.account_file_path, 'utf-8');
            this.pool = (0, utils_1.parseJSON)(accountStr, []);
        }
        else {
            fs.mkdirSync('./run', { recursive: true });
            this.syncfile();
        }
    }
    ClaudeAccountPool.prototype.syncfile = function () {
        fs.writeFileSync(this.account_file_path, JSON.stringify(this.pool));
    };
    ClaudeAccountPool.prototype.getByID = function (id) {
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.id === id) {
                return item;
            }
        }
    };
    ClaudeAccountPool.prototype.delete = function (id) {
        this.pool = this.pool.filter(function (item) { return item.id !== id; });
        this.syncfile();
    };
    ClaudeAccountPool.prototype.get = function () {
        var now = (0, moment_1.default)();
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.cookie.length > 0 && !this.using.has(item.id)) {
                console.log("find old login account:", JSON.stringify(item));
                item.last_use_time = now.format(TimeFormat);
                this.syncfile();
                this.using.add(item.id);
                return item;
            }
        }
        var newAccount = {
            id: (0, uuid_1.v4)(),
            last_use_time: now.format(TimeFormat),
            cookie: [],
            organization_uuid: '',
        };
        this.pool.push(newAccount);
        this.syncfile();
        this.using.add(newAccount.id);
        return newAccount;
    };
    ClaudeAccountPool.prototype.multiGet = function (size) {
        var result = [];
        for (var i = 0; i < size; i++) {
            result.push(this.get());
        }
        return result;
    };
    return ClaudeAccountPool;
}());
var Claude = /** @class */ (function (_super) {
    __extends(Claude, _super);
    function Claude(options) {
        var _this = _super.call(this, options) || this;
        _this.accountPool = new ClaudeAccountPool();
        var maxSize = +(process.env.CLAUDE_POOL_SIZE || 0);
        _this.pagePool = new puppeteer_1.BrowserPool(maxSize, _this, true);
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://claude.ai/api',
            headers: {
                'Content-Type': 'application/json',
            },
        }, false);
        return _this;
    }
    Claude.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.Claude2_100k:
                return 75000;
            default:
                return 0;
        }
    };
    Claude.prototype.ask = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var et, res, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        et = new utils_1.EventStream();
                        return [4 /*yield*/, this.askStream(req, et)];
                    case 1:
                        res = _a.sent();
                        result = {
                            content: '',
                        };
                        return [2 /*return*/, new Promise(function (resolve) {
                                et.read(function (event, data) {
                                    if (!data) {
                                        return;
                                    }
                                    switch (event) {
                                        case 'message':
                                            result.content = data.content;
                                            break;
                                        case 'done':
                                            result.content = data.content;
                                            break;
                                        case 'error':
                                            result.error = data.error;
                                            break;
                                        default:
                                            console.error(data);
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
    Claude.prototype.deleteID = function (id) {
        this.accountPool.delete(id);
    };
    Claude.prototype.newID = function () {
        var account = this.accountPool.get();
        return account.id;
    };
    Claude.prototype.isLogin = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.waitForSelector('.flex > .flex > .overflow-y-auto > .ProseMirror > .is-empty', { timeout: 10 * 1000 })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Claude.prototype.getOrgID = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForRequest(function (req) { return req.url().indexOf('https://claude.ai/api/organizations') !== -1; })];
                    case 1:
                        req = _a.sent();
                        return [2 /*return*/, req.url().split('/')[5] || ''];
                }
            });
        });
    };
    Claude.prototype.init = function (id, browser) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var account, page, _b, emailBox, emailAddress, element, msgs, validateCode, _i, msgs_1, msg, continueLogin, adultAccept, agreeAccept, _c, e_2;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        account = this.accountPool.getByID(id);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 39, , 40]);
                        if (!account) {
                            throw new Error('account undefined, something error');
                        }
                        return [4 /*yield*/, browser.pages()];
                    case 2:
                        page = (_d.sent())[0];
                        return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                    case 3:
                        _d.sent();
                        if (!(account.cookie.length > 0)) return [3 /*break*/, 7];
                        this.getOrgID(page).then(function (id) {
                            account.organization_uuid = id;
                            _this.accountPool.syncfile();
                        });
                        return [4 /*yield*/, page.goto('https://claude.ai')];
                    case 4:
                        _d.sent();
                        _b = account;
                        return [4 /*yield*/, page.cookies('https://claude.ai')];
                    case 5:
                        _b.cookie = _d.sent();
                        return [4 /*yield*/, this.isLogin(page)];
                    case 6:
                        if (_d.sent()) {
                            return [2 /*return*/, [page, account]];
                        }
                        _d.label = 7;
                    case 7: 
                    // start
                    return [4 /*yield*/, page.goto('https://claude.ai')];
                    case 8:
                        // start
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('#email')];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, page.click('#email')];
                    case 10:
                        _d.sent();
                        emailBox = (0, emailFactory_1.CreateEmail)(process.env.EMAIL_TYPE || emailFactory_1.TempEmailType.TempEmail44);
                        return [4 /*yield*/, emailBox.getMailAddress()];
                    case 11:
                        emailAddress = _d.sent();
                        account.email = emailAddress;
                        return [4 /*yield*/, page.keyboard.type(emailAddress, { delay: 10 })];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, page.evaluateHandle(function () {
                                var elements = Array.from(document.querySelectorAll('* > main > * > .contents > *'));
                                return elements.find(function (element) { var _a, _b; return ((_b = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, 'Continue')) !== -1; });
                            })];
                    case 13:
                        element = _d.sent();
                        //@ts-ignore
                        return [4 /*yield*/, element.click()];
                    case 14:
                        //@ts-ignore
                        _d.sent();
                        // 点击输入验证码
                        return [4 /*yield*/, page.waitForSelector('#code')];
                    case 15:
                        // 点击输入验证码
                        _d.sent();
                        return [4 /*yield*/, page.click('#code')];
                    case 16:
                        _d.sent();
                        return [4 /*yield*/, emailBox.waitMails()];
                    case 17:
                        msgs = (_d.sent());
                        validateCode = void 0;
                        for (_i = 0, msgs_1 = msgs; _i < msgs_1.length; _i++) {
                            msg = msgs_1[_i];
                            validateCode = (_a = msg.content.match(/>(\d{6})</i)) === null || _a === void 0 ? void 0 : _a[1];
                            if (validateCode) {
                                break;
                            }
                        }
                        if (!validateCode) {
                            throw new Error('Error while obtaining verfication code!');
                        }
                        return [4 /*yield*/, page.keyboard.type(validateCode, { delay: 10 })];
                    case 18:
                        _d.sent();
                        return [4 /*yield*/, page.evaluateHandle(function () {
                                var elements = Array.from(document.querySelectorAll('* > main > * > .contents > *'));
                                return elements.find(function (element) {
                                    var _a;
                                    return ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().indexOf('continue with login code')) !== -1;
                                });
                            })];
                    case 19:
                        continueLogin = _d.sent();
                        //@ts-ignore
                        return [4 /*yield*/, continueLogin.click()];
                    case 20:
                        //@ts-ignore
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('#fullname')];
                    case 21:
                        _d.sent();
                        return [4 /*yield*/, page.click('#fullname')];
                    case 22:
                        _d.sent();
                        return [4 /*yield*/, page.keyboard.type((0, utils_1.randomStr)(10), { delay: 10 })];
                    case 23:
                        _d.sent();
                        return [4 /*yield*/, page.evaluateHandle(function () {
                                var elements = Array.from(document.querySelectorAll('input'));
                                return elements.find(function (element) { return element.id === ':r1:'; });
                            })];
                    case 24:
                        adultAccept = _d.sent();
                        //@ts-ignore
                        return [4 /*yield*/, adultAccept.click()];
                    case 25:
                        //@ts-ignore
                        _d.sent();
                        return [4 /*yield*/, page.evaluateHandle(function () {
                                var elements = Array.from(document.querySelectorAll('input'));
                                return elements.find(function (element) { return element.id === ':r2:'; });
                            })];
                    case 26:
                        agreeAccept = _d.sent();
                        //@ts-ignore
                        return [4 /*yield*/, agreeAccept.click()];
                    case 27:
                        //@ts-ignore
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('.h-full > main > .grid > button')];
                    case 28:
                        _d.sent();
                        return [4 /*yield*/, page.click('.h-full > main > .grid > button')];
                    case 29:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('main > .flex > .max-w-sm > .mt-4 > button')];
                    case 30:
                        _d.sent();
                        return [4 /*yield*/, page.click('main > .flex > .max-w-sm > .mt-4 > button')];
                    case 31:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('main > .flex > .max-w-sm > .mt-4 > button:nth-child(2)')];
                    case 32:
                        _d.sent();
                        return [4 /*yield*/, page.click('main > .flex > .max-w-sm > .mt-4 > button:nth-child(2)')];
                    case 33:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('main > .flex > .max-w-sm > .mt-4 > button:nth-child(2)')];
                    case 34:
                        _d.sent();
                        return [4 /*yield*/, page.click('main > .flex > .max-w-sm > .mt-4 > button:nth-child(2)')];
                    case 35:
                        _d.sent();
                        return [4 /*yield*/, page.waitForSelector('main > .flex > .max-w-sm > .mt-4 > button:nth-child(2)')];
                    case 36:
                        _d.sent();
                        return [4 /*yield*/, page.click('main > .flex > .max-w-sm > .mt-4 > button:nth-child(2)')];
                    case 37:
                        _d.sent();
                        // end
                        _c = account;
                        return [4 /*yield*/, page.cookies('https://claude.ai')];
                    case 38:
                        // end
                        _c.cookie = _d.sent();
                        this.accountPool.syncfile();
                        console.log('register claude successfully');
                        return [2 /*return*/, [page, account]];
                    case 39:
                        e_2 = _d.sent();
                        console.warn('something error happened,err:', e_2);
                        return [2 /*return*/, []];
                    case 40: return [2 /*return*/];
                }
            });
        });
    };
    Claude.ifLogin = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, page.waitForSelector('#root > .app > .sider > .premium > .user-info', { timeout: 10 * 1000 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('#root > .app > .sider > .premium > .user-info')];
                    case 2:
                        _a.sent();
                        console.log('still login in');
                        return [2 /*return*/, true];
                    case 3:
                        e_3 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Claude.skipIntro = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, page.waitForSelector('div > div > button > .semi-typography > strong', { timeout: 5 * 1000 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('div > div > button > .semi-typography > strong')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        console.error(e_4.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Claude.clear = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForSelector('.ChatApp > .ChatFooter > .tool-bar > .semi-button:nth-child(1) > .semi-button-content', { timeout: 10 * 60 * 1000 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('.ChatApp > .ChatFooter > .tool-bar > .semi-button:nth-child(1) > .semi-button-content')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Claude.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, account, done, destroy, data, createRes, res, old, e_5;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.pagePool.get(), page = _a[0], account = _a[1], done = _a[2], destroy = _a[3];
                        if (!account || !page || account.cookie.length === 0) {
                            stream.write(utils_1.Event.error, { error: 'please wait init.....about 1 min' });
                            stream.end();
                            return [2 /*return*/];
                        }
                        data = {
                            attachments: [],
                            completion: {
                                prompt: req.prompt,
                                timezone: 'Asia/Shanghai',
                                model: 'claude-2',
                                incremental: false,
                            },
                            conversation_uuid: (0, uuid_1.v4)(),
                            organization_uuid: account.organization_uuid,
                            text: req.prompt,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.client.post("/organizations/".concat(account.organization_uuid, "/chat_conversations"), {
                                name: '',
                                uuid: data.conversation_uuid,
                            }, {
                                headers: {
                                    Cookie: account.cookie
                                        .map(function (item) { return "".concat(item.name, "=").concat(item.value); })
                                        .join('; '),
                                },
                            })];
                    case 2:
                        createRes = _b.sent();
                        console.log(createRes);
                        return [4 /*yield*/, this.client.post('/append_message', data, {
                                responseType: 'stream',
                                headers: {
                                    Accept: 'text/event-stream',
                                    Cookie: account.cookie
                                        .map(function (item) { return "".concat(item.name, "=").concat(item.value); })
                                        .join('; '),
                                },
                            })];
                    case 3:
                        res = _b.sent();
                        old = '';
                        res.data.pipe(event_stream_1.default.map(function (chunk, cb) { return __awaiter(_this, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                res = chunk.toString();
                                if (!res) {
                                    return [2 /*return*/];
                                }
                                stream.write(utils_1.Event.message, { content: res || '' });
                                return [2 /*return*/];
                            });
                        }); }));
                        res.data.on('close', function () {
                            stream.write(utils_1.Event.done, { content: '' });
                            stream.end();
                            done(account);
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        e_5 = _b.sent();
                        console.error('claude ask stream failed, err', e_5);
                        stream.write(utils_1.Event.error, { error: e_5.message });
                        stream.end();
                        destroy();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Claude;
}(base_1.Chat));
exports.Claude = Claude;
