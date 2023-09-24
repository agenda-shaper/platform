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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magic = void 0;
var base_1 = require("../base");
var puppeteer_1 = require("../../utils/puppeteer");
var fs = require("fs");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var moment_1 = require("moment");
var proxyAgent_1 = require("../../utils/proxyAgent");
var MaxGptTimes = 20;
var TimeFormat = 'YYYY-MM-DD HH:mm:ss';
var modelMap = (_a = {},
    _a[base_1.ModelType.ClaudeInstance] = {
        id: 'claude-instant',
        name: 'CLAUDE-INSTANT',
    },
    _a[base_1.ModelType.Claude100k] = {
        id: 'claude-instant-100k',
        name: 'CLAUDE-INSTANT-100K',
    },
    _a[base_1.ModelType.Claude] = {
        id: 'claude+',
        name: 'CLAUDE+',
    },
    _a[base_1.ModelType.GPT4] = {
        id: 'gpt-4',
        name: 'GPT-4',
    },
    _a[base_1.ModelType.GPT3p5Turbo] = {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5-TURBO',
    },
    _a);
var MagicAccountPool = /** @class */ (function () {
    function MagicAccountPool() {
        this.pool = [];
        this.account_file_path = './run/account_Magic.json';
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
    MagicAccountPool.prototype.syncfile = function () {
        fs.writeFileSync(this.account_file_path, JSON.stringify(this.pool));
    };
    MagicAccountPool.prototype.getByID = function (id) {
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.id === id) {
                return item;
            }
        }
    };
    MagicAccountPool.prototype.delete = function (id) {
        this.pool = this.pool.filter(function (item) { return item.id !== id; });
        this.syncfile();
    };
    MagicAccountPool.prototype.get = function () {
        var now = (0, moment_1.default)();
        var minInterval = 60 * 60 + 10 * 60; // 1hour + 10min
        var newAccount = {
            id: (0, uuid_1.v4)(),
            last_use_time: now.format(TimeFormat),
            gpt4times: 0,
        };
        this.pool.push(newAccount);
        this.syncfile();
        return newAccount;
    };
    MagicAccountPool.prototype.multiGet = function (size) {
        var result = [];
        for (var i = 0; i < size; i++) {
            result.push(this.get());
        }
        return result;
    };
    return MagicAccountPool;
}());
var Magic = /** @class */ (function (_super) {
    __extends(Magic, _super);
    function Magic(options) {
        var _this = _super.call(this, options) || this;
        _this.ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.67';
        _this.accountPool = new MagicAccountPool();
        var maxSize = +(process.env.MAGIC_POOL_SIZE || 0);
        _this.pagePool = new puppeteer_1.BrowserPool(maxSize, _this);
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://magic.ninomae.top/api/',
            headers: {
                'Content-Type': 'application/json',
                Origin: 'https://magic.ninomae.top',
                Referer: 'https://magic.ninomae.top',
                'User-Agent': _this.ua,
            },
        }, false);
        return _this;
    }
    Magic.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.ClaudeInstance:
                return 4000;
            case base_1.ModelType.Claude100k:
                return 50000;
            case base_1.ModelType.Claude:
                return 4000;
            case base_1.ModelType.GPT4:
                return 4000;
            case base_1.ModelType.GPT3p5Turbo:
                return 2500;
            default:
                return 0;
        }
    };
    Magic.prototype.deleteID = function (id) {
        this.accountPool.delete(id);
    };
    Magic.prototype.newID = function () {
        var account = this.accountPool.get();
        return account.id;
    };
    Magic.prototype.init = function (id, browser) {
        return __awaiter(this, void 0, void 0, function () {
            var account, page, _a, cookies, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        account = this.accountPool.getByID(id);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        if (!account) {
                            throw new Error('account undefined, something error');
                        }
                        return [4 /*yield*/, browser.pages()];
                    case 2:
                        page = (_b.sent())[0];
                        _a = this;
                        return [4 /*yield*/, browser.userAgent()];
                    case 3:
                        _a.ua = _b.sent();
                        return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.goto('https://magic.ninomae.top')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('.relative > .absolute > .stretch > .relative > .m-0')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, page.cookies()];
                    case 7:
                        cookies = _b.sent();
                        account.cookies = cookies
                            .map(function (item) { return "".concat(item.name, "=").concat(item.value); })
                            .join(';');
                        if (!account.cookies) {
                            throw new Error('cookies got failed!');
                        }
                        this.accountPool.syncfile();
                        console.log('register Magic successfully');
                        return [2 /*return*/, [page, account]];
                    case 8:
                        e_1 = _b.sent();
                        console.warn('something error happened,err:', e_1);
                        return [2 /*return*/, []];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Magic.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, account, done, destroy, data, res, e_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.pagePool.get(), page = _a[0], account = _a[1], done = _a[2], destroy = _a[3];
                        if (!account || !page) {
                            stream.write(utils_1.Event.error, { error: 'please wait init.....about 1 min' });
                            stream.end();
                            return [2 /*return*/];
                        }
                        data = {
                            key: '',
                            prompt: '',
                            messages: req.messages,
                            model: modelMap[req.model],
                            temperature: 1,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.post('/chat', data, {
                                headers: {
                                    Cookie: account.cookies,
                                    'User-Agent': this.ua,
                                },
                                responseType: 'stream',
                            })];
                    case 2:
                        res = _b.sent();
                        res.data.on('data', function (chunk) {
                            stream.write(utils_1.Event.message, { content: chunk.toString() });
                        });
                        res.data.on('close', function () {
                            stream.write(utils_1.Event.done, { content: '' });
                            stream.end();
                            done(account);
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
                        e_2 = _b.sent();
                        console.error(e_2.message);
                        stream.write(utils_1.Event.error, { error: e_2.message });
                        stream.end();
                        destroy();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Magic;
}(base_1.Chat));
exports.Magic = Magic;
