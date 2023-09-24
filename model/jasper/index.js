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
exports.Jasper = void 0;
var base_1 = require("../base");
var puppeteer_1 = require("../../utils/puppeteer");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var fs_1 = require("fs");
var moment_1 = require("moment");
var MaxFailedTimes = 10;
var ModelMap = (_a = {},
    _a[base_1.ModelType.GPT3p5Turbo] = '#gpt35',
    _a[base_1.ModelType.GPT4] = '#gpt4',
    _a);
var AccountPool = /** @class */ (function () {
    function AccountPool() {
        this.pool = {};
        this.using = new Set();
        this.account_file_path = './run/account_sincode.json';
        if (!process.env.SINCODE_EMAIL || !process.env.SINCODE_PASSWORD) {
            console.log('sincode found 0 account');
            return;
        }
        var sigList = process.env.SINCODE_EMAIL.split('|');
        var mainList = process.env.SINCODE_PASSWORD.split('|');
        if (fs_1.default.existsSync(this.account_file_path)) {
            var accountStr = fs_1.default.readFileSync(this.account_file_path, 'utf-8');
            this.pool = (0, utils_1.parseJSON)(accountStr, {});
        }
        else {
            fs_1.default.mkdirSync('./run', { recursive: true });
            this.syncfile();
        }
        for (var key in this.pool) {
            this.pool[key].failedCnt = 0;
            this.pool[key].model = undefined;
            if (!('vip' in this.pool)) {
                this.pool[key].vip = true;
            }
        }
        for (var idx in sigList) {
            var sig = sigList[idx];
            var main = mainList[idx];
            if (this.pool[sig]) {
                continue;
            }
            this.pool[sig] = {
                id: (0, uuid_1.v4)(),
                email: sig,
                password: main,
                failedCnt: 0,
                invalid: false,
                vip: true,
            };
        }
        console.log("read sincode account total:".concat(Object.keys(this.pool).length));
        this.syncfile();
    }
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
    AccountPool.prototype.get = function () {
        for (var _i = 0, _a = (0, utils_1.shuffleArray)(Object.values(this.pool)); _i < _a.length; _i++) {
            var vv = _a[_i];
            if ((!vv.invalid ||
                (0, moment_1.default)().subtract(5, 'm').isAfter((0, moment_1.default)(vv.last_use_time))) &&
                !this.using.has(vv.id) &&
                vv.vip) {
                vv.invalid = false;
                this.syncfile();
                this.using.add(vv.id);
                return vv;
            }
        }
        console.log('sincode pb run out!!!!!!');
        return {
            id: (0, uuid_1.v4)(),
            email: '',
            failedCnt: 0,
        };
    };
    return AccountPool;
}());
var Jasper = /** @class */ (function (_super) {
    __extends(Jasper, _super);
    function Jasper(options) {
        var _this = _super.call(this, options) || this;
        _this.SLNewChat = '#scrollbar > #scrollbar1 > .bubble-element > .clickable-element > .bubble-element:nth-child(2)';
        _this.SLInput = 'textarea';
        _this.accountPool = new AccountPool();
        _this.pagePool = new puppeteer_1.BrowserPool(+(process.env.JASPER_POOL_SIZE || 0), _this, false, 10 * 1000, false);
        return _this;
    }
    Jasper.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.GPT4:
                return 6000;
            case base_1.ModelType.GPT3p5Turbo:
                return 6000;
            default:
                return 0;
        }
    };
    Jasper.prototype.deleteID = function (id) {
        this.accountPool.delete(id);
    };
    Jasper.prototype.release = function (id) {
        this.accountPool.release(id);
    };
    Jasper.prototype.newID = function () {
        var account = this.accountPool.get();
        return account.id;
    };
    Jasper.prototype.init = function (id, browser, options) {
        return __awaiter(this, void 0, void 0, function () {
            var account, page, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = this.accountPool.getByID(id);
                        if (!!account) return [3 /*break*/, 3];
                        return [4 /*yield*/, browser.close()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, utils_1.sleep)(10 * 60 * 60 * 1000)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [4 /*yield*/, browser.newPage()];
                    case 4:
                        page = _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 11, , 13]);
                        return [4 /*yield*/, (0, puppeteer_1.simplifyPage)(page)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (0, utils_1.sleep)(1000)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.goto("https://app.jasper.ai/chat")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, (0, utils_1.sleep)(10 * 60 * 1000)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/, [page, account]];
                    case 11:
                        e_1 = _a.sent();
                        this.logger.warn("account:".concat(account === null || account === void 0 ? void 0 : account.id, ", something error happened."), e_1);
                        account.failedCnt += 1;
                        this.accountPool.syncfile();
                        return [4 /*yield*/, (0, utils_1.sleep)(Math.floor(Math.random() * 10 * 60 * 1000))];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Jasper.prototype.newChat = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForSelector(this.SLNewChat)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click(this.SLNewChat)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Jasper.prototype.isLogin = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // new chat
                        return [4 /*yield*/, page.waitForSelector(this.SLNewChat, { timeout: 15 * 1000 })];
                    case 1:
                        // new chat
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Jasper.goHome = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goto("https://www.sincode.ai")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Jasper.prototype.isVIP = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForSelector(this.SLInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click(this.SLInput)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.keyboard.type('say 1')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.keyboard.press('Enter')];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, page.waitForSelector('body > div.bubble-element.CustomElement.cnaMaEa0.bubble-r-container.relative', { timeout: 5000 })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 7:
                        e_3 = _a.sent();
                        return [2 /*return*/, true];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Jasper.prototype.changeMode = function (page, model) {
        if (model === void 0) { model = base_1.ModelType.GPT4; }
        return __awaiter(this, void 0, void 0, function () {
            var selector, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, page.waitForSelector('#features')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('#features')];
                    case 2:
                        _a.sent();
                        selector = ModelMap[model];
                        if (!selector) return [3 /*break*/, 5];
                        return [4 /*yield*/, page.waitForSelector(selector, {
                                timeout: 3 * 1000,
                                visible: true,
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.click(selector)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, true];
                    case 6:
                        e_4 = _a.sent();
                        this.logger.error(e_4.message);
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Jasper.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, account, done, destroy, client, tt, old, et, currMsgID_1, ok, e_5;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.pagePool.get(), page = _a[0], account = _a[1], done = _a[2], destroy = _a[3];
                        if (!account || !page) {
                            stream.write(utils_1.Event.error, { error: 'please retry later!' });
                            stream.write(utils_1.Event.done, { content: '' });
                            stream.end();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, page.target().createCDPSession()];
                    case 1:
                        client = _b.sent();
                        tt = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                this.logger.error('wait msg timeout, destroyed!');
                                client.removeAllListeners('Network.webSocketFrameReceived');
                                stream.write(utils_1.Event.error, { error: 'please retry later!' });
                                stream.write(utils_1.Event.done, { content: '' });
                                stream.end();
                                destroy(undefined, undefined, 10 * 60 * 1000);
                                return [2 /*return*/];
                            });
                        }); }, 10 * 1000);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 10, , 11]);
                        old = '';
                        et = void 0;
                        currMsgID_1 = '';
                        return [4 /*yield*/, client.send('Network.enable')];
                    case 3:
                        _b.sent();
                        et = client.on('Network.webSocketFrameReceived', function (_a) {
                            var response = _a.response, requestId = _a.requestId;
                            var rest2 = [];
                            for (var _i = 1; _i < arguments.length; _i++) {
                                rest2[_i - 1] = arguments[_i];
                            }
                            return __awaiter(_this, void 0, void 0, function () {
                                var dataStr, e_6;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            dataStr = (response === null || response === void 0 ? void 0 : response.payloadData) || '';
                                            if (!dataStr) {
                                                return [2 /*return*/];
                                            }
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 6, , 7]);
                                            if (dataStr === 'pong') {
                                                return [2 /*return*/];
                                            }
                                            tt.refresh();
                                            if (!(dataStr.indexOf('xxUNKNOWNERRORxx') !== -1)) return [3 /*break*/, 3];
                                            client.removeAllListeners('Network.webSocketFrameReceived');
                                            clearTimeout(tt);
                                            this.logger.error("sincode return error, ".concat(dataStr));
                                            return [4 /*yield*/, this.newChat(page)];
                                        case 2:
                                            _b.sent();
                                            stream.write(utils_1.Event.error, { error: 'please retry later!' });
                                            stream.end();
                                            account.failedCnt += 1;
                                            account.last_use_time = (0, moment_1.default)().format(utils_1.TimeFormat);
                                            account.invalid = true;
                                            this.accountPool.syncfile();
                                            destroy(undefined, undefined, 10 * 60 * 1000);
                                            return [2 /*return*/];
                                        case 3:
                                            if (dataStr.indexOf('RESPONSE_START') !== -1) {
                                                currMsgID_1 = requestId;
                                                return [2 /*return*/];
                                            }
                                            if (!(dataStr.indexOf('DONE') !== -1)) return [3 /*break*/, 5];
                                            client.removeAllListeners('Network.webSocketFrameReceived');
                                            clearTimeout(tt);
                                            stream.write(utils_1.Event.done, { content: '' });
                                            stream.end();
                                            account.failedCnt = 0;
                                            this.accountPool.syncfile();
                                            return [4 /*yield*/, this.newChat(page)];
                                        case 4:
                                            _b.sent();
                                            this.logger.info("recv msg ok");
                                            done(account);
                                            _b.label = 5;
                                        case 5:
                                            if (requestId !== currMsgID_1) {
                                                return [2 /*return*/];
                                            }
                                            stream.write(utils_1.Event.message, { content: dataStr });
                                            return [3 /*break*/, 7];
                                        case 6:
                                            e_6 = _b.sent();
                                            this.logger.error("handle msg failed, dataStr:".concat(dataStr, ", err:"), e_6);
                                            return [3 /*break*/, 7];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        this.logger.info('sincode start send msg');
                        if (!(req.model !== account.model)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.changeMode(page, req.model)];
                    case 4:
                        ok = _b.sent();
                        if (ok) {
                            account.model = req.model;
                        }
                        _b.label = 5;
                    case 5: return [4 /*yield*/, page.waitForSelector(this.SLInput)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, page.click(this.SLInput)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, client.send('Input.insertText', { text: req.prompt })];
                    case 8:
                        _b.sent();
                        this.logger.info('sincode find input ok');
                        return [4 /*yield*/, page.keyboard.press('Enter')];
                    case 9:
                        _b.sent();
                        this.logger.info('sincode send msg ok!');
                        return [3 /*break*/, 11];
                    case 10:
                        e_5 = _b.sent();
                        client.removeAllListeners('Network.webSocketFrameReceived');
                        clearTimeout(tt);
                        this.logger.error("account: id=".concat(account.id, ", sincode ask stream failed:"), e_5);
                        account.failedCnt += 1;
                        account.model = undefined;
                        this.accountPool.syncfile();
                        destroy(undefined, undefined, 10 * 60 * 1000);
                        stream.write(utils_1.Event.error, { error: 'some thing error, try again later' });
                        stream.write(utils_1.Event.done, { content: '' });
                        stream.end();
                        return [2 /*return*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return Jasper;
}(base_1.Chat));
exports.Jasper = Jasper;
