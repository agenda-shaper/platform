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
exports.Ram = void 0;
var base_1 = require("../base");
var puppeteer_1 = require("../../utils/puppeteer");
var fs = require("fs");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var moment_1 = require("moment");
var event_stream_1 = require("event-stream");
var proxyAgent_1 = require("../../utils/proxyAgent");
var TimeFormat = 'YYYY-MM-DD HH:mm:ss';
var RamAccountPool = /** @class */ (function () {
    function RamAccountPool() {
        this.pool = [];
        this.account_file_path = './run/account_ram.json';
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
    RamAccountPool.prototype.syncfile = function () {
        fs.writeFileSync(this.account_file_path, JSON.stringify(this.pool));
    };
    RamAccountPool.prototype.getByID = function (id) {
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.id === id) {
                return item;
            }
        }
    };
    RamAccountPool.prototype.delete = function (id) {
        this.pool = this.pool.filter(function (item) { return item.id !== id; });
        this.syncfile();
    };
    RamAccountPool.prototype.get = function () {
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
        };
        this.pool.push(newAccount);
        this.syncfile();
        this.using.add(newAccount.id);
        return newAccount;
    };
    RamAccountPool.prototype.multiGet = function (size) {
        var result = [];
        for (var i = 0; i < size; i++) {
            result.push(this.get());
        }
        return result;
    };
    return RamAccountPool;
}());
var Ram = /** @class */ (function (_super) {
    __extends(Ram, _super);
    function Ram(options) {
        var _this = _super.call(this, options) || this;
        _this.useragent = (0, utils_1.randomUserAgent)();
        _this.accountPool = new RamAccountPool();
        var maxSize = +(process.env.RAM_POOL_SIZE || 0);
        _this.pagePool = new puppeteer_1.BrowserPool(maxSize, _this, false);
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://chat.ramxn.dev/backend-api',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                Origin: 'https://chat.ramxn.dev',
                Referer: 'https://chat.ramxn.dev',
                'Cache-Control': 'no-cache',
                'User-Agent': _this.useragent,
            },
        }, false);
        return _this;
    }
    Ram.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.GPT3p5_16k:
                return 11000;
            default:
                return 0;
        }
    };
    Ram.prototype.deleteID = function (id) {
        this.accountPool.delete(id);
    };
    Ram.prototype.newID = function () {
        var account = this.accountPool.get();
        return account.id;
    };
    Ram.prototype.init = function (id, browser) {
        return __awaiter(this, void 0, void 0, function () {
            var account, page, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        account = this.accountPool.getByID(id);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        if (!account) {
                            throw new Error('account undefined, something error');
                        }
                        return [4 /*yield*/, browser.pages()];
                    case 2:
                        page = (_b.sent())[0];
                        return [4 /*yield*/, page.setUserAgent(this.useragent)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.goto('https://chat.ramxn.dev/chat/')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, (0, utils_1.sleep)(10000)];
                    case 5:
                        _b.sent();
                        _a = account;
                        return [4 /*yield*/, page.cookies('https://chat.ramxn.dev')];
                    case 6:
                        _a.cookie = _b.sent();
                        if (account.cookie.length === 0) {
                            throw new Error('ram got cookie failed');
                        }
                        this.accountPool.syncfile();
                        setTimeout(function () { return browser.close().catch(); }, 1000);
                        console.log('register ram successfully');
                        return [2 /*return*/, [page, account]];
                    case 7:
                        e_1 = _b.sent();
                        console.warn('something error happened,err:', e_1);
                        return [2 /*return*/, []];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Ram.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, account, done, destroy, data, res, e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.pagePool.get(), page = _a[0], account = _a[1], done = _a[2], destroy = _a[3];
                        if (!account || !page || !account.cookie || account.cookie.length === 0) {
                            stream.write(utils_1.Event.error, { error: 'please wait init.....about 1 min' });
                            stream.end();
                            return [2 /*return*/];
                        }
                        data = {
                            api_key: '',
                            action: 'ask',
                            conversation_id: (0, uuid_1.v4)(),
                            jailbreak: 'default',
                            meta: {
                                id: (0, utils_1.randomStr)(15),
                                content: {
                                    content_type: 'ask',
                                    conversation: req.messages.slice(0, req.messages.length - 1),
                                    internet_access: false,
                                    parts: [req.messages[req.messages.length - 1]],
                                },
                            },
                            model: req.model,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        account.useTimes += 1;
                        this.accountPool.syncfile();
                        return [4 /*yield*/, this.client.post('/v2/conversation', data, {
                                responseType: 'stream',
                                headers: {
                                    Cookie: account.cookie
                                        .map(function (item) { return "".concat(item.name, "=").concat(item.value); })
                                        .join('; '),
                                },
                            })];
                    case 2:
                        res = _b.sent();
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
                            if (account.useTimes >= 500) {
                                destroy();
                            }
                            else {
                                done(account);
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        console.error('ram ask stream failed, err', e_2);
                        stream.write(utils_1.Event.error, { error: e_2.message });
                        stream.end();
                        destroy(true);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Ram;
}(base_1.Chat));
exports.Ram = Ram;
