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
exports.ChatDemo = void 0;
var base_1 = require("../base");
var puppeteer_1 = require("../../utils/puppeteer");
var fs = require("fs");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var moment_1 = require("moment");
var event_stream_1 = require("event-stream");
var proxyAgent_1 = require("../../utils/proxyAgent");
var TimeFormat = 'YYYY-MM-DD HH:mm:ss';
var AccountPool = /** @class */ (function () {
    function AccountPool() {
        this.pool = [];
        this.account_file_path = './run/account_demochat.json';
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
    AccountPool.prototype.syncfile = function () {
        fs.writeFileSync(this.account_file_path, JSON.stringify(this.pool));
    };
    AccountPool.prototype.getByID = function (id) {
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.id === id) {
                return item;
            }
        }
    };
    AccountPool.prototype.delete = function (id) {
        this.pool = this.pool.filter(function (item) { return item.id !== id; });
        this.syncfile();
    };
    AccountPool.prototype.get = function () {
        var now = (0, moment_1.default)();
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if ((item.useTimes < 10 ||
                (0, moment_1.default)(item.last_use_time).isBefore((0, moment_1.default)().subtract(1, 'd').subtract(2, 'h'))) &&
                !this.using.has(item.id)) {
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
            useTimes: 0,
            token: '',
        };
        this.pool.push(newAccount);
        this.syncfile();
        this.using.add(newAccount.id);
        return newAccount;
    };
    AccountPool.prototype.multiGet = function (size) {
        var result = [];
        for (var i = 0; i < size; i++) {
            result.push(this.get());
        }
        return result;
    };
    return AccountPool;
}());
var ChatDemo = /** @class */ (function (_super) {
    __extends(ChatDemo, _super);
    function ChatDemo(options) {
        var _this = _super.call(this, options) || this;
        _this.useragent = (0, utils_1.randomUserAgent)();
        _this.accountPool = new AccountPool();
        var maxSize = +(process.env.DEMOCHAT_POOL_SIZE || 0);
        _this.pagePool = new puppeteer_1.BrowserPool(maxSize, _this, false);
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://chat.chatgptdemo.net',
            headers: {
                'Content-Type': 'application/json',
                accept: 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Proxy-Connection': 'keep-alive',
                Referer: 'https://chat.chatgptdemo.net/',
                Origin: 'https://chat.chatgptdemo.net',
            },
        }, true);
        return _this;
    }
    ChatDemo.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.GPT3p5Turbo:
                return 3000;
            case base_1.ModelType.GPT3p5_16k:
                return 3000;
            default:
                return 0;
        }
    };
    ChatDemo.prototype.deleteID = function (id) {
        this.accountPool.delete(id);
    };
    ChatDemo.prototype.newID = function () {
        var account = this.accountPool.get();
        return account.id;
    };
    ChatDemo.prototype.init = function (id, browser) {
        return __awaiter(this, void 0, void 0, function () {
            var account, page, _a, _b, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = this.accountPool.getByID(id);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 9, , 10]);
                        if (!account) {
                            throw new Error('account undefined, something error');
                        }
                        return [4 /*yield*/, browser.pages()];
                    case 2:
                        page = (_c.sent())[0];
                        return [4 /*yield*/, page.setUserAgent(this.useragent)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, page.goto('https://chat.chatgptdemo.net/')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, (0, utils_1.sleep)(2000)];
                    case 5:
                        _c.sent();
                        _a = account;
                        return [4 /*yield*/, page.cookies('https://chat.chatgptdemo.net')];
                    case 6:
                        _a.cookie = _c.sent();
                        if (account.cookie.length === 0) {
                            throw new Error('demochat got cookie failed');
                        }
                        return [4 /*yield*/, this.closePOP(page)];
                    case 7:
                        _c.sent();
                        _b = account;
                        return [4 /*yield*/, this.getToken(page)];
                    case 8:
                        _b.token = _c.sent();
                        this.accountPool.syncfile();
                        this.logger.info('register demochat successfully');
                        return [2 /*return*/, [page, account]];
                    case 9:
                        e_1 = _c.sent();
                        this.logger.warn('something error happened,err:', e_1.message);
                        return [2 /*return*/, []];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ChatDemo.prototype.closePOP = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.evaluate(function () {
                            // @ts-ignore
                            return (document.querySelector('#ADS-block-detect > div.ads-block-popup').style.display = 'none');
                        })];
                    case 1:
                        _a.sent();
                        // @ts-ignore
                        return [4 /*yield*/, page.evaluate(function () {
                                // @ts-ignore
                                return (document.querySelector('#ADS-block-detect > div.overlay').style.display = 'none');
                            })];
                    case 2:
                        // @ts-ignore
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatDemo.prototype.getToken = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.evaluate(function () { return $('#TTT').text(); })];
                    case 1:
                        token = _a.sent();
                        return [2 /*return*/, token];
                }
            });
        });
    };
    ChatDemo.prototype.getChatID = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var chatid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.evaluate(function () {
                            // @ts-ignore
                            return $('.chatbox-item.focused').attr('id');
                        })];
                    case 1:
                        chatid = _a.sent();
                        return [2 /*return*/, chatid];
                }
            });
        });
    };
    ChatDemo.prototype.newChat = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForSelector('.app > #main-menu > .main > .button-container > .button')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('.app > #main-menu > .main > .button-container > .button')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatDemo.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, account, done, destroy, data, res, e_2;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.pagePool.get(), page = _a[0], account = _a[1], done = _a[2], destroy = _a[3];
                        if (!account || !page || !account.cookie || account.cookie.length === 0) {
                            stream.write(utils_1.Event.error, { error: 'please wait init.....about 1 min' });
                            stream.end();
                            return [2 /*return*/];
                        }
                        _b = {
                            question: req.prompt
                        };
                        return [4 /*yield*/, this.getChatID(page)];
                    case 1:
                        data = (_b.chat_id = _c.sent(),
                            _b.timestamp = (0, moment_1.default)().valueOf(),
                            _b.token = account.token,
                            _b);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 6]);
                        account.useTimes += 1;
                        this.accountPool.syncfile();
                        return [4 /*yield*/, this.client.post('/chat_api_stream', data, {
                                responseType: 'stream',
                                headers: {
                                    Cookie: account.cookie
                                        .map(function (item) { return "".concat(item.name, "=").concat(item.value); })
                                        .join('; '),
                                },
                            })];
                    case 3:
                        res = _c.sent();
                        res.data.pipe(event_stream_1.default.split(/\r?\n\r?\n/)).pipe(event_stream_1.default.map(function (chunk, cb) { return __awaiter(_this, void 0, void 0, function () {
                            var dataStr, data, _a, _b, content, finish_reason;
                            return __generator(this, function (_c) {
                                dataStr = chunk.replace('data: ', '');
                                if (!dataStr) {
                                    return [2 /*return*/];
                                }
                                data = (0, utils_1.parseJSON)(dataStr, {});
                                if (!(data === null || data === void 0 ? void 0 : data.choices)) {
                                    stream.write(utils_1.Event.error, { error: 'not found data.choices' });
                                    stream.end();
                                    return [2 /*return*/];
                                }
                                _a = data.choices[0], _b = _a.delta.content, content = _b === void 0 ? '' : _b, finish_reason = _a.finish_reason;
                                if (finish_reason === 'stop') {
                                    return [2 /*return*/];
                                }
                                stream.write(utils_1.Event.message, { content: content });
                                return [2 /*return*/];
                            });
                        }); }));
                        res.data.on('close', function () {
                            stream.write(utils_1.Event.done, { content: '' });
                            stream.end();
                            _this.newChat(page);
                            done(account);
                        });
                        return [3 /*break*/, 6];
                    case 4:
                        e_2 = _c.sent();
                        this.logger.error('demochat ask stream failed, err', e_2.message);
                        stream.write(utils_1.Event.error, { error: e_2.message });
                        stream.end();
                        return [4 /*yield*/, this.newChat(page)];
                    case 5:
                        _c.sent();
                        destroy(true);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ChatDemo;
}(base_1.Chat));
exports.ChatDemo = ChatDemo;
