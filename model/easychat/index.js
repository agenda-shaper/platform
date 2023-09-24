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
exports.EasyChat = void 0;
var base_1 = require("../base");
var puppeteer_1 = require("../../utils/puppeteer");
var emailFactory_1 = require("../../utils/emailFactory");
var fs = require("fs");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var moment_1 = require("moment");
var turndown_1 = require("turndown");
var proxyAgent_1 = require("../../utils/proxyAgent");
var event_stream_1 = require("event-stream");
var turndownService = new turndown_1.default({ codeBlockStyle: 'fenced' });
var MaxGptTimes = 10;
var TimeFormat = 'YYYY-MM-DD HH:mm:ss';
var EasyChatAccountPool = /** @class */ (function () {
    function EasyChatAccountPool() {
        this.pool = [];
        this.account_file_path = './run/account_EasyChat.json';
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
    EasyChatAccountPool.prototype.syncfile = function () {
        fs.writeFileSync(this.account_file_path, JSON.stringify(this.pool));
    };
    EasyChatAccountPool.prototype.getByID = function (id) {
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.id === id) {
                return item;
            }
        }
    };
    EasyChatAccountPool.prototype.delete = function (id) {
        this.pool = this.pool.filter(function (item) { return item.id !== id; });
        this.syncfile();
    };
    EasyChatAccountPool.prototype.get = function () {
        var now = (0, moment_1.default)();
        var minInterval = 60 * 60 + 10 * 60; // 1hour + 10min
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if (now.unix() - (0, moment_1.default)(item.last_use_time).unix() > minInterval) {
                console.log("find old login account:", JSON.stringify(item));
                item.last_use_time = now.format(TimeFormat);
                this.syncfile();
                return item;
            }
        }
        var newAccount = {
            id: (0, uuid_1.v4)(),
            last_use_time: now.format(TimeFormat),
            gpt4times: 0,
        };
        this.pool.push(newAccount);
        this.syncfile();
        return newAccount;
    };
    EasyChatAccountPool.prototype.multiGet = function (size) {
        var result = [];
        for (var i = 0; i < size; i++) {
            result.push(this.get());
        }
        return result;
    };
    return EasyChatAccountPool;
}());
var EasyChat = /** @class */ (function (_super) {
    __extends(EasyChat, _super);
    function EasyChat(options) {
        var _this = _super.call(this, options) || this;
        _this.model = (options === null || options === void 0 ? void 0 : options.model) || base_1.ModelType.GPT4;
        _this.accountPool = new EasyChatAccountPool();
        var maxSize = +(process.env.EASYCHAT_POOL_SIZE || 0);
        _this.pagePool = new puppeteer_1.BrowserPool(maxSize, _this);
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://free.easychat.work/api/openai/v1/',
            headers: {
                'Content-Type': 'application/json',
                accept: 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Proxy-Connection': 'keep-alive',
            },
        });
        return _this;
    }
    EasyChat.prototype.support = function (model) {
        switch (model) {
            case this.model:
                return 5000;
            default:
                return 0;
        }
    };
    EasyChat.closeWelcomePop = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, page.waitForSelector('.fixed > #radix-\\:r0\\: > .flex > .button_icon-button__BC_Ca > .button_icon-button-text__k3vob')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('.fixed > #radix-\\:r0\\: > .flex > .button_icon-button__BC_Ca > .button_icon-button-text__k3vob')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log('not need close welcome pop');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EasyChat.prototype.deleteID = function (id) {
        this.accountPool.delete(id);
    };
    EasyChat.prototype.newID = function () {
        var account = this.accountPool.get();
        return account.id;
    };
    EasyChat.prototype.init = function (id, browser) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var account, page, emailBox, emailAddress, msgs, validateCode, _i, msgs_1, msg, cookies, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        account = this.accountPool.getByID(id);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 24, , 25]);
                        if (!account) {
                            throw new Error('account undefined, something error');
                        }
                        return [4 /*yield*/, browser.pages()];
                    case 2:
                        page = (_b.sent())[0];
                        return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                    case 3:
                        _b.sent();
                        if (!account.login_time) return [3 /*break*/, 5];
                        return [4 /*yield*/, browser.close()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, [page, account]];
                    case 5: return [4 /*yield*/, page.goto('https://free.easychat.work/#/register')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('#email')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, page.click('#email')];
                    case 8:
                        _b.sent();
                        emailBox = (0, emailFactory_1.CreateEmail)(process.env.EMAIL_TYPE || emailFactory_1.TempEmailType.TempEmail44);
                        return [4 /*yield*/, emailBox.getMailAddress()];
                    case 9:
                        emailAddress = _b.sent();
                        account.email = emailAddress;
                        account.gpt4times = 0;
                        this.accountPool.syncfile();
                        // 将文本键入焦点元素
                        return [4 /*yield*/, page.keyboard.type(emailAddress, { delay: 10 })];
                    case 10:
                        // 将文本键入焦点元素
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('#password')];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, page.click('#password')];
                    case 12:
                        _b.sent();
                        account.password = (0, utils_1.randomStr)(12);
                        return [4 /*yield*/, page.keyboard.type(account.password, { delay: 10 })];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('#submit')];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, page.click('#submit')];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, emailBox.waitMails()];
                    case 16:
                        msgs = (_b.sent());
                        validateCode = void 0;
                        for (_i = 0, msgs_1 = msgs; _i < msgs_1.length; _i++) {
                            msg = msgs_1[_i];
                            validateCode = (_a = msg.content.match(/\b\d{6}\b/i)) === null || _a === void 0 ? void 0 : _a[0];
                            if (validateCode) {
                                break;
                            }
                        }
                        if (!validateCode) {
                            throw new Error('Error while obtaining verfication URL!');
                        }
                        return [4 /*yield*/, page.waitForSelector('#showOtp')];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, page.click('#showOtp')];
                    case 18:
                        _b.sent();
                        return [4 /*yield*/, page.keyboard.type(validateCode, { delay: 10 })];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('#submit')];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, page.click('#submit')];
                    case 21:
                        _b.sent();
                        account.login_time = (0, moment_1.default)().format(TimeFormat);
                        account.gpt4times = 0;
                        this.accountPool.syncfile();
                        return [4 /*yield*/, EasyChat.closeWelcomePop(page)];
                    case 22:
                        _b.sent();
                        return [4 /*yield*/, page.cookies()];
                    case 23:
                        cookies = _b.sent();
                        account.cookies = cookies
                            .map(function (item) { return "".concat(item.name, "=").concat(item.value); })
                            .join(';');
                        if (!account.cookies) {
                            throw new Error('cookies got failed!');
                        }
                        this.accountPool.syncfile();
                        console.log('register EasyChat successfully');
                        return [2 /*return*/, [page, account]];
                    case 24:
                        e_2 = _b.sent();
                        console.warn('something error happened,err:', e_2);
                        return [2 /*return*/, []];
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    EasyChat.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, account, done, destroy, model, data, res, old_1, e_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req.prompt = req.prompt.replace(/\n/g, ' ');
                        _a = this.pagePool.get(), page = _a[0], account = _a[1], done = _a[2], destroy = _a[3];
                        if (!account || !page) {
                            stream.write(utils_1.Event.error, { error: 'please retry later!' });
                            stream.end();
                            return [2 /*return*/];
                        }
                        model = 'gpt-4';
                        switch (model) {
                            case base_1.ModelType.GPT3p5Turbo:
                                model = 'gpt-3.5-turbo';
                                break;
                        }
                        data = {
                            frequency_penalty: 0,
                            messages: [{ role: 'user', content: req.prompt }],
                            model: model,
                            presence_penalty: 0,
                            stream: true,
                            temperature: 1,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.post('/chat/completions', data, {
                                responseType: 'stream',
                                headers: {
                                    Cookie: account.cookies,
                                },
                            })];
                    case 2:
                        res = _b.sent();
                        old_1 = '';
                        res.data.pipe(event_stream_1.default.split(/\r?\n\r?\n/)).pipe(event_stream_1.default.map(function (chunk, cb) { return __awaiter(_this, void 0, void 0, function () {
                            var dataStr, data_1, _a, _b, content, finish_reason;
                            return __generator(this, function (_c) {
                                try {
                                    dataStr = chunk.replace('data: ', '');
                                    if (!dataStr) {
                                        return [2 /*return*/];
                                    }
                                    if (dataStr === '[DONE]') {
                                        stream.write(utils_1.Event.done, { content: old_1 });
                                        stream.end();
                                        return [2 /*return*/];
                                    }
                                    data_1 = (0, utils_1.parseJSON)(dataStr, {});
                                    if (!(data_1 === null || data_1 === void 0 ? void 0 : data_1.choices)) {
                                        stream.write(utils_1.Event.error, { error: 'not found data.choices' });
                                        stream.end();
                                        return [2 /*return*/];
                                    }
                                    _a = data_1.choices[0], _b = _a.delta.content, content = _b === void 0 ? '' : _b, finish_reason = _a.finish_reason;
                                    if (finish_reason === 'stop' ||
                                        content.indexOf("https://discord.gg/cattogpt") !== -1) {
                                        return [2 /*return*/];
                                    }
                                    old_1 = content;
                                    stream.write(utils_1.Event.message, { content: content });
                                }
                                catch (e) {
                                    console.error(e.message);
                                }
                                return [2 /*return*/];
                            });
                        }); }));
                        res.data.on('close', function () {
                            console.log('easy chat close');
                            account.gpt4times += 1;
                            _this.accountPool.syncfile();
                            if (account.gpt4times >= MaxGptTimes) {
                                account.gpt4times = 0;
                                account.last_use_time = (0, moment_1.default)().format(TimeFormat);
                                _this.accountPool.syncfile();
                                destroy();
                            }
                            else {
                                done(account);
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _b.sent();
                        console.error(e_3.message);
                        stream.write(utils_1.Event.error, { error: e_3.message });
                        stream.end();
                        destroy();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return EasyChat;
}(base_1.Chat));
exports.EasyChat = EasyChat;
