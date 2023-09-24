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
exports.FakeOpen = void 0;
var base_1 = require("../base");
var proxyAgent_1 = require("../../utils/proxyAgent");
var event_stream_1 = require("event-stream");
var utils_1 = require("../../utils");
var fs_1 = require("fs");
var uuid_1 = require("uuid");
var moment_1 = require("moment/moment");
var AccountPool = /** @class */ (function () {
    function AccountPool() {
        this.pool = {};
        this.using = new Set();
        this.account_file_path = './run/account_fakeopen.json';
        this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://ai.fakeopen.com',
            headers: {
                accept: '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                pragma: 'no-cache',
                'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest',
                cookie: 'sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22188a317c40520a-0c3c4294c10036-1b525634-1296000-188a317c406435%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTg4YTMxN2M0MDUyMGEtMGMzYzQyOTRjMTAwMzYtMWI1MjU2MzQtMTI5NjAwMC0xODhhMzE3YzQwNjQzNSJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%2C%22%24device_id%22%3A%22188a317c40520a-0c3c4294c10036-1b525634-1296000-188a317c406435%22%7D',
                Referer: 'https://ai.fakeopen.com/auth1',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
        });
        this.initialize();
    }
    AccountPool.prototype.initialize = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var mailList, pwdList, accountStr, key, _b, _c, _d, _i, idx, mail, pwd, loginResp, access_token, validModelsResp, categories, plus, registerResp, token_key, e_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!process.env.FAKE_OPEN_EMAIL || !process.env.FAKE_OPEN_PASSWORD) {
                            console.log('fakeopen found 0 account');
                            return [2 /*return*/];
                        }
                        mailList = process.env.FAKE_OPEN_EMAIL.split('|');
                        pwdList = process.env.FAKE_OPEN_PASSWORD.split('|');
                        if (fs_1.default.existsSync(this.account_file_path)) {
                            accountStr = fs_1.default.readFileSync(this.account_file_path, 'utf-8');
                            this.pool = (0, utils_1.parseJSON)(accountStr, {});
                        }
                        else {
                            fs_1.default.mkdirSync('./run', { recursive: true });
                            this.syncfile();
                        }
                        for (key in this.pool) {
                            this.pool[key].failedCnt = 0;
                            this.pool[key].model = undefined;
                            if (!('plus' in this.pool)) {
                                this.pool[key].plus = true;
                            }
                        }
                        _b = mailList;
                        _c = [];
                        for (_d in _b)
                            _c.push(_d);
                        _i = 0;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _c.length)) return [3 /*break*/, 8];
                        _d = _c[_i];
                        if (!(_d in _b)) return [3 /*break*/, 7];
                        idx = _d;
                        mail = mailList[idx];
                        pwd = pwdList[idx];
                        if (this.pool[mail]) {
                            return [3 /*break*/, 7];
                        }
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.client.post('/auth/login', { username: mail, password: pwd }, {
                                responseType: 'json',
                            })];
                    case 3:
                        loginResp = _e.sent();
                        access_token = loginResp.data.access_token;
                        return [4 /*yield*/, this.client.get('/api/models?history_and_training_disabled=false', {
                                responseType: 'json',
                                // 替换headers中的Authorization
                                headers: {
                                    Authorization: "Bearer ".concat(access_token),
                                },
                            })];
                    case 4:
                        validModelsResp = _e.sent();
                        categories = validModelsResp.data.categories;
                        plus = ((_a = categories.find(function (item) { return item.category === 'gpt_4'; })) === null || _a === void 0 ? void 0 : _a.subscription_level) === 'plus';
                        return [4 /*yield*/, this.client.post('/token/register', {
                                unique_name: mail,
                                access_token: access_token,
                                expires_in: 0,
                                site_limit: '',
                                show_conversations: true,
                            }, {
                                responseType: 'json',
                            })];
                    case 5:
                        registerResp = _e.sent();
                        token_key = registerResp.data.token_key;
                        this.pool[mail] = {
                            id: (0, uuid_1.v4)(),
                            email: mail,
                            password: pwd,
                            access_token: access_token,
                            token_key: token_key,
                            failedCnt: 0,
                            invalid: false,
                            plus: plus,
                        };
                        this.syncfile();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _e.sent();
                        console.error(e_1);
                        this.pool[mail] = {
                            id: (0, uuid_1.v4)(),
                            email: mail,
                            password: pwd,
                            access_token: '',
                            token_key: '',
                            failedCnt: 0,
                            invalid: true,
                            plus: false,
                        };
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        console.log("read fakeopen account total:".concat(Object.keys(this.pool).length));
                        this.syncfile();
                        return [2 /*return*/];
                }
            });
        });
    };
    AccountPool.prototype.syncfile = function () {
        fs_1.default.writeFileSync(this.account_file_path, JSON.stringify(this.pool));
    };
    AccountPool.prototype.getByID = function (id) {
        for (var item in this.pool) {
            if (this.pool[item].id === id) {
                return this.pool[item];
            }
        }
    };
    AccountPool.prototype.delete = function (id) {
        for (var v in this.pool) {
            var vv = this.pool[v];
        }
        this.using.delete(id);
        this.syncfile();
    };
    AccountPool.prototype.release = function (id) {
        this.using.delete(id);
    };
    AccountPool.prototype.get = function (isPlus) {
        for (var _i = 0, _a = (0, utils_1.shuffleArray)(Object.values(this.pool)); _i < _a.length; _i++) {
            var vv = _a[_i];
            if ((!vv.invalid ||
                (0, moment_1.default)().subtract(5, 'm').isAfter((0, moment_1.default)(vv.last_use_time))) &&
                !this.using.has(vv.id) &&
                ((isPlus && vv.plus === isPlus) || !isPlus)) {
                vv.invalid = false;
                this.syncfile();
                this.using.add(vv.id);
                return vv;
            }
        }
        console.log('fakeopen accessToken run out!!!!!!');
        return {
            id: (0, uuid_1.v4)(),
            email: '',
            failedCnt: 0,
        };
    };
    return AccountPool;
}());
var FakeOpen = /** @class */ (function (_super) {
    __extends(FakeOpen, _super);
    function FakeOpen(options) {
        var _this = _super.call(this, options) || this;
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://ai.fakeopen.com/v1/',
            headers: {
                'Content-Type': 'application/json',
                accept: 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Proxy-Connection': 'keep-alive',
                Authorization: "Bearer ".concat(process.env.FAKE_OPEN_KEY ||
                    'pk-this-is-a-real-free-api-key-pk-for-everyone'),
            },
        }, false);
        _this.accountPool = new AccountPool();
        return _this;
    }
    FakeOpen.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.GPT3p5_16k:
                return 21000;
            case base_1.ModelType.GPT4:
                return 5000;
            case base_1.ModelType.GPT3p5Turbo:
                return 21000;
            default:
                return 0;
        }
    };
    FakeOpen.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var data, account, res, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            messages: [{ role: 'user', content: req.prompt }],
                            temperature: 1.0,
                            model: req.model,
                            stream: true,
                        };
                        account = this.accountPool.get(req.model === base_1.ModelType.GPT4);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.post('/chat/completions', data, {
                                responseType: 'stream',
                                // 替换headers中的Authorization
                                headers: {
                                    Authorization: "Bearer ".concat(account.token_key),
                                },
                            })];
                    case 2:
                        res = _a.sent();
                        res.data.pipe(event_stream_1.default.split(/\r?\n\r?\n/)).pipe(event_stream_1.default.map(function (chunk, cb) { return __awaiter(_this, void 0, void 0, function () {
                            var dataStr, data, _a, _b, content, finish_reason;
                            return __generator(this, function (_c) {
                                dataStr = chunk.replace('data: ', '');
                                if (!dataStr) {
                                    return [2 /*return*/];
                                }
                                if (dataStr === '[DONE]') {
                                    stream.write(utils_1.Event.done, { content: '' });
                                    stream.end();
                                    this.accountPool.release(account.id);
                                    return [2 /*return*/];
                                }
                                data = (0, utils_1.parseJSON)(dataStr, {});
                                if (!(data === null || data === void 0 ? void 0 : data.choices)) {
                                    stream.write(utils_1.Event.error, { error: 'not found data.choices' });
                                    stream.end();
                                    this.accountPool.release(account.id);
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
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2.message);
                        stream.write(utils_1.Event.error, { error: e_2.message });
                        stream.end();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return FakeOpen;
}(base_1.Chat));
exports.FakeOpen = FakeOpen;
