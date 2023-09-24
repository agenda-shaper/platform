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
exports.Forefrontnew = void 0;
var base_1 = require("../base");
var puppeteer_1 = require("../../utils/puppeteer");
var emailFactory_1 = require("../../utils/emailFactory");
var proxyAgent_1 = require("../../utils/proxyAgent");
var fs = require("fs");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var moment_1 = require("moment");
var event_stream_1 = require("event-stream");
var MaxGptTimes = 95;
var TimeFormat = 'YYYY-MM-DD HH:mm:ss';
var AccountPool = /** @class */ (function () {
    function AccountPool() {
        this.pool = [];
        this.account_file_path = './run/account_forefront.json';
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
        var minInterval = 3 * 60 * 60 + 10 * 60; // 3hour + 10min
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var item = _a[_i];
            if (now.unix() - (0, moment_1.default)(item.last_use_time).unix() > minInterval ||
                item.gpt4times < MaxGptTimes) {
                console.log("find forefront old login account: ", item.id);
                item.last_use_time = now.format(TimeFormat);
                this.syncfile();
                return item;
            }
        }
        var newAccount = {
            id: (0, uuid_1.v4)(),
            last_use_time: now.format(TimeFormat),
            gpt4times: 0,
            cookies: [],
        };
        this.pool.push(newAccount);
        this.syncfile();
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
var Forefrontnew = /** @class */ (function (_super) {
    __extends(Forefrontnew, _super);
    function Forefrontnew(options) {
        var _this = _super.call(this, options) || this;
        _this.accountPool = new AccountPool();
        _this.net = options === null || options === void 0 ? void 0 : options.net;
        var maxSize = +(process.env.POOL_SIZE || 0);
        _this.pagePool = new puppeteer_1.BrowserPool(maxSize, _this, false, 10 * 1000, true);
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://streaming-worker.forefront.workers.dev',
            headers: {
                Accept: '*/*',
                Connection: 'Keep-alive',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            },
        });
        return _this;
    }
    Forefrontnew.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.GPT3p5Turbo:
                return 2500;
            case base_1.ModelType.Claude:
                return 2500;
            default:
                return 0;
        }
    };
    Forefrontnew.prototype.tryValidate = function (validateURL, triedTimes) {
        return __awaiter(this, void 0, void 0, function () {
            var tsl, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (triedTimes === 10) {
                            throw new Error('validate failed');
                        }
                        triedTimes += 1;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, (0, proxyAgent_1.CreateTlsProxy)({ clientIdentifier: 'chrome_108' }).get(validateURL)];
                    case 2:
                        tsl = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [4 /*yield*/, this.tryValidate(validateURL, triedTimes)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Forefrontnew.closeWelcomePop = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        console.log('try close welcome pop');
                        return [4 /*yield*/, page.waitForSelector('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.click('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.click('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.flex > .grid > .w-full > .cursor-pointer > .w-full')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.click('.flex > .grid > .w-full > .cursor-pointer > .w-full')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.click('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, page.click('.relative > .flex > .w-full > .flex > .onboarding-button')];
                    case 12:
                        _a.sent();
                        console.log('close welcome pop ok');
                        return [3 /*break*/, 14];
                    case 13:
                        e_2 = _a.sent();
                        console.log('not need close welcome pop');
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    Forefrontnew.prototype.deleteID = function (id) {
        this.accountPool.delete(id);
    };
    Forefrontnew.prototype.newID = function () {
        var account = this.accountPool.get();
        return account.id;
    };
    Forefrontnew.getChatID = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForResponse(function (res) {
                            return res.request().method() === 'GET' &&
                                res.url().indexOf('listWorkspaces') !== -1;
                        })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data[0].result.data.json[0].id];
                }
            });
        });
    };
    Forefrontnew.prototype.init = function (id, browser, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var account, page, ok, _b, emailBox, emailAddress, newB, msgs, validateURL, _i, msgs_1, msg, _c, _d, e_3;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        account = this.accountPool.getByID(id);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 28, , 29]);
                        if (!account) {
                            throw new Error('account undefined, something error');
                        }
                        if (!options) {
                            throw new Error('forefront failed get options');
                        }
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        page = _e.sent();
                        if (!(account.cookies.length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, page.setCookie.apply(page, account.cookies)];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, page.goto('https://chat.forefront.ai/')];
                    case 5:
                        _e.sent();
                        Forefrontnew.getChatID(page).then(function (id) { return (account.chatID = id); });
                        return [4 /*yield*/, Forefrontnew.ifLogin(page)];
                    case 6:
                        ok = _e.sent();
                        if (!ok) {
                            console.log("logins status expired, delete ".concat(account.id));
                            return [2 /*return*/, [undefined, account]];
                        }
                        _b = account;
                        return [4 /*yield*/, this.getAuth(page)];
                    case 7:
                        _b.headers = _e.sent();
                        return [2 /*return*/, [page, account]];
                    case 8: return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, page.goto('https://accounts.forefront.ai/sign-up')];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, page.waitForSelector('#emailAddress-field')];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, page.click('#emailAddress-field')];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, page.waitForSelector('.cl-rootBox > .cl-card > .cl-main > .cl-form > .cl-formButtonPrimary')];
                    case 13:
                        _e.sent();
                        return [4 /*yield*/, page.click('.cl-rootBox > .cl-card > .cl-main > .cl-form > .cl-formButtonPrimary')];
                    case 14:
                        _e.sent();
                        emailBox = (0, emailFactory_1.CreateEmail)(process.env.EMAIL_TYPE || emailFactory_1.TempEmailType.TempEmail44);
                        return [4 /*yield*/, emailBox.getMailAddress()];
                    case 15:
                        emailAddress = _e.sent();
                        account.email = emailAddress;
                        this.accountPool.syncfile();
                        // 将文本键入焦点元素
                        return [4 /*yield*/, page.keyboard.type(emailAddress, { delay: 10 })];
                    case 16:
                        // 将文本键入焦点元素
                        _e.sent();
                        return [4 /*yield*/, page.keyboard.press('Enter')];
                    case 17:
                        _e.sent();
                        return [4 /*yield*/, (options === null || options === void 0 ? void 0 : options.waitDisconnect(10 * 1000))];
                    case 18:
                        newB = _e.sent();
                        return [4 /*yield*/, newB.pages()];
                    case 19:
                        page = (_e.sent())[0];
                        return [4 /*yield*/, page.setViewport({ width: 1520, height: 1080 })];
                    case 20:
                        _e.sent();
                        return [4 /*yield*/, page.reload()];
                    case 21:
                        _e.sent();
                        return [4 /*yield*/, emailBox.waitMails()];
                    case 22:
                        msgs = (_e.sent());
                        validateURL = void 0;
                        for (_i = 0, msgs_1 = msgs; _i < msgs_1.length; _i++) {
                            msg = msgs_1[_i];
                            validateURL = (_a = msg.content.match(/https:\/\/clerk\.forefront\.ai\/v1\/verify\?_clerk_js_version=(\d+\.\d+\.\d+)&amp;token=[^\s"]+/i)) === null || _a === void 0 ? void 0 : _a[0];
                            validateURL = validateURL === null || validateURL === void 0 ? void 0 : validateURL.replace('amp;', '');
                            if (validateURL) {
                                break;
                            }
                        }
                        if (!validateURL) {
                            throw new Error('Error while obtaining verfication URL!');
                        }
                        return [4 /*yield*/, this.tryValidate(validateURL, 0)];
                    case 23:
                        _e.sent();
                        Forefrontnew.getChatID(page).then(function (id) { return (account.chatID = id); });
                        return [4 /*yield*/, Forefrontnew.closeWelcomePop(page)];
                    case 24:
                        _e.sent();
                        return [4 /*yield*/, page.waitForSelector('.relative > .flex > .w-full > .text-th-primary-dark > div', { timeout: 120000 })];
                    case 25:
                        _e.sent();
                        _c = account;
                        return [4 /*yield*/, this.getAuth(page)];
                    case 26:
                        _c.headers = _e.sent();
                        _d = account;
                        return [4 /*yield*/, page.cookies()];
                    case 27:
                        _d.cookies = (_e.sent()).filter(function (v) { return v.name === '__session'; });
                        account.login_time = (0, moment_1.default)().format(TimeFormat);
                        this.accountPool.syncfile();
                        console.log('register successfully');
                        return [2 /*return*/, [page, account]];
                    case 28:
                        e_3 = _e.sent();
                        console.warn('something error happened,err:', e_3);
                        return [2 /*return*/, []];
                    case 29: return [2 /*return*/];
                }
            });
        });
    };
    Forefrontnew.ifLogin = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, page.waitForSelector('.flex:nth-child(1) > .flex > .relative:nth-child(1) > .flex > .text-sm', { timeout: 5000 })];
                    case 1:
                        _a.sent();
                        console.log('forefront still login in');
                        return [2 /*return*/, true];
                    case 2:
                        e_4 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Forefrontnew.prototype.getAuth = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, auth, sign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForSelector('.relative > .flex > .w-full > .text-th-primary-dark > div', {
                            timeout: 10000,
                            visible: true,
                        })];
                    case 1:
                        _a.sent();
                        console.log('try get auth');
                        return [4 /*yield*/, page.click('.relative > .flex > .w-full > .text-th-primary-dark > div')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.focus('.relative > .flex > .w-full > .text-th-primary-dark > div')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.keyboard.type('say 1')];
                    case 4:
                        _a.sent();
                        page.keyboard.press('Enter').then();
                        return [4 /*yield*/, page.waitForResponse(function (r) {
                                return (r.request().method() === 'POST' &&
                                    r.url() === 'https://streaming-worker.forefront.workers.dev/chat');
                            })];
                    case 5:
                        res = _a.sent();
                        headers = res.request().headers();
                        auth = headers['authorization'];
                        sign = headers['x-signature'];
                        if (!(!auth || !sign)) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, utils_1.sleep)(2000)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, this.getAuth(page)];
                    case 7:
                        console.log('get auth ok!');
                        return [2 /*return*/, headers];
                }
            });
        });
    };
    Forefrontnew.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, account, done, destroy, data, res, old, e_5;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.pagePool.get(), page = _a[0], account = _a[1], done = _a[2], destroy = _a[3];
                        if (!account || !page || !account.chatID || !account.headers) {
                            stream.write(utils_1.Event.error, { error: 'please wait init.....about 1 min' });
                            stream.end();
                            return [2 /*return*/];
                        }
                        data = {
                            text: req.prompt,
                            action: 'new',
                            id: '',
                            parentId: account.chatID || '',
                            workspaceId: account.chatID || '',
                            messagePersona: 'default',
                            model: req.model,
                            messages: [],
                            internetMode: this.net ? 'always' : 'never',
                            hidden: true,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.post('/chat', data, {
                                responseType: 'stream',
                                headers: __assign({}, account.headers),
                            })];
                    case 2:
                        res = _b.sent();
                        old = '';
                        res.data.pipe(event_stream_1.default.split('\n\n')).pipe(event_stream_1.default.map(function (chunk, cb) { return __awaiter(_this, void 0, void 0, function () {
                            var res, _a, eventStr, dataStr, event, data;
                            var _b, _c, _d;
                            return __generator(this, function (_e) {
                                res = chunk.toString();
                                if (!res) {
                                    return [2 /*return*/];
                                }
                                _a = res.split('\n'), eventStr = _a[0], dataStr = _a[1];
                                event = eventStr.replace('event: ', '');
                                if (event == 'end') {
                                    stream.write(utils_1.Event.done, { content: '' });
                                    return [2 /*return*/];
                                }
                                data = (0, utils_1.parseJSON)(dataStr.replace('data: ', ''), {
                                    delta: '',
                                    error: { message: '' },
                                });
                                if (((_b = data === null || data === void 0 ? void 0 : data.error) === null || _b === void 0 ? void 0 : _b.message) &&
                                    ((_d = (_c = data === null || data === void 0 ? void 0 : data.error) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.indexOf('rate limit')) !== -1) {
                                    stream.write(utils_1.Event.error, { error: 'please retry!' });
                                    stream.end();
                                    return [2 /*return*/];
                                }
                                stream.write(utils_1.Event.message, { content: data.delta || '' });
                                return [2 /*return*/];
                            });
                        }); }));
                        res.data.on('close', function () {
                            stream.end();
                            account.gpt4times += 1;
                            _this.accountPool.syncfile();
                            account.last_use_time = (0, moment_1.default)().format(TimeFormat);
                            if (account.gpt4times >= MaxGptTimes) {
                                account.gpt4times = 0;
                                _this.accountPool.syncfile();
                                destroy();
                            }
                            else {
                                done(account);
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _b.sent();
                        console.error('forefront ask stream failed, err', e_5);
                        stream.write(utils_1.Event.error, { error: e_5.message });
                        stream.end();
                        destroy();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Forefrontnew;
}(base_1.Chat));
exports.Forefrontnew = Forefrontnew;
