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
exports.simplifyPageAll = exports.simplifyPage = exports.closeOtherPages = exports.BrowserPool = void 0;
var puppeteer_1 = require("puppeteer");
var fs = require("fs");
var index_1 = require("./index");
var proxyAgent_1 = require("./proxyAgent");
var puppeteer = require('puppeteer-extra');
var StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
var BrowserPool = /** @class */ (function () {
    function BrowserPool(size, user, saveFile, poolDelay, useConnect) {
        if (saveFile === void 0) { saveFile = true; }
        if (poolDelay === void 0) { poolDelay = 5 * 1000; }
        if (useConnect === void 0) { useConnect = false; }
        this.pool = [];
        this.size = size;
        this.user = user;
        this.savefile = saveFile;
        this.poolDelay = poolDelay;
        this.useConnect = useConnect;
        this.init();
    }
    BrowserPool.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, id, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.size)) return [3 /*break*/, 7];
                        id = this.user.newID();
                        info = {
                            id: id,
                            ready: false,
                        };
                        this.pool.push(info);
                        if (!(this.poolDelay === -1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.initOne(id)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.initOne(id).then();
                        _a.label = 4;
                    case 4:
                        if (!(this.poolDelay > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, index_1.sleep)(this.poolDelay)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BrowserPool.prototype.find = function (id) {
        for (var _i = 0, _a = this.pool; _i < _a.length; _i++) {
            var info = _a[_i];
            if (info.id === id) {
                return info;
            }
        }
    };
    BrowserPool.prototype.initOne = function (id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var info, options, browser, page, data, wsLink_1, newID, e_1, newID;
            var _b, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        info = this.find(id);
                        if (!info) {
                            console.error('init one failed, not found info');
                            return [2 /*return*/];
                        }
                        options = {
                            headless: process.env.DEBUG === '1' ? false : 'new',
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-sandbox',
                                '--disable-background-timer-throttling',
                                '--disable-backgrounding-occluded-windows',
                            ],
                            userDataDir: this.savefile ? "run/".concat(info.id) : undefined,
                        };
                        if (process.env.http_proxy) {
                            (_a = options.args) === null || _a === void 0 ? void 0 : _a.push("--proxy-server=".concat(process.env.http_proxy));
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 13, , 18]);
                        page = void 0, data = void 0;
                        if (!this.useConnect) return [3 /*break*/, 5];
                        if (!process.env.CHROME_PATH) {
                            throw new Error('not config CHROME_PATH');
                        }
                        return [4 /*yield*/, (0, proxyAgent_1.launchChromeAndFetchWsUrl)()];
                    case 2:
                        wsLink_1 = _d.sent();
                        if (!wsLink_1) {
                            throw new Error('launch chrome failed');
                        }
                        console.log('got: ', wsLink_1);
                        return [4 /*yield*/, puppeteer_1.default.connect({ browserWSEndpoint: wsLink_1 })];
                    case 3:
                        browser = _d.sent();
                        info.ws = wsLink_1;
                        return [4 /*yield*/, this.user.init(info.id, browser, {
                                waitDisconnect: function (delay) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                browser.disconnect();
                                                return [4 /*yield*/, (0, index_1.sleep)(delay)];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, puppeteer_1.default.connect({ browserWSEndpoint: wsLink_1 })];
                                            case 2:
                                                browser = _a.sent();
                                                return [4 /*yield*/, (0, index_1.sleep)(1000)];
                                            case 3:
                                                _a.sent();
                                                return [2 /*return*/, browser];
                                        }
                                    });
                                }); },
                            })];
                    case 4:
                        _b = _d.sent(), page = _b[0], data = _b[1];
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, puppeteer.launch(options)];
                    case 6:
                        browser = _d.sent();
                        return [4 /*yield*/, this.user.init(info.id, browser)];
                    case 7:
                        _c = _d.sent(), page = _c[0], data = _c[1];
                        _d.label = 8;
                    case 8:
                        if (!!page) return [3 /*break*/, 12];
                        this.user.deleteID(info.id);
                        newID = this.user.newID();
                        console.warn("init ".concat(info.id, " failed, delete! init new ").concat(newID));
                        return [4 /*yield*/, browser.close()];
                    case 9:
                        _d.sent();
                        if (options.userDataDir) {
                            fs.rm(options.userDataDir, { force: true, recursive: true }, function () {
                                console.log("".concat(info.id, " has been deleted"));
                            });
                        }
                        return [4 /*yield*/, (0, index_1.sleep)(5000)];
                    case 10:
                        _d.sent();
                        info.id = newID;
                        return [4 /*yield*/, this.initOne(info.id)];
                    case 11: return [2 /*return*/, _d.sent()];
                    case 12:
                        info.page = page;
                        info.data = data;
                        info.ready = true;
                        return [3 /*break*/, 18];
                    case 13:
                        e_1 = _d.sent();
                        if (!browser) return [3 /*break*/, 15];
                        return [4 /*yield*/, browser.close()];
                    case 14:
                        _d.sent();
                        _d.label = 15;
                    case 15:
                        console.error('init one failed, err:', e_1);
                        this.user.deleteID(info.id);
                        newID = this.user.newID();
                        console.warn("init ".concat(info.id, " failed, delete! init new ").concat(newID));
                        if (options.userDataDir) {
                            fs.rm(options.userDataDir, { force: true, recursive: true }, function () {
                                console.log("".concat(info.id, " has been deleted"));
                            });
                        }
                        return [4 /*yield*/, (0, index_1.sleep)(5000)];
                    case 16:
                        _d.sent();
                        info.id = newID;
                        return [4 /*yield*/, this.initOne(info.id)];
                    case 17: return [2 /*return*/, _d.sent()];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    BrowserPool.prototype.deleteIDFile = function (id) {
        fs.rm("run/".concat(id), { force: true, recursive: true }, function () {
            console.log("".concat(id, " has been deleted"));
        });
    };
    //@ts-ignore
    BrowserPool.prototype.get = function () {
        var _this = this;
        var _loop_1 = function (item) {
            if (item.ready) {
                item.ready = false;
                return { value: [
                        item.page,
                        item.data,
                        function (data) {
                            item.ready = true;
                            item.data = data;
                        },
                        function (force, notCreate, randomSleep) {
                            if (force === void 0) { force = false; }
                            if (notCreate === void 0) { notCreate = false; }
                            if (randomSleep === void 0) { randomSleep = 0; }
                            return __awaiter(_this, void 0, void 0, function () {
                                var misec;
                                var _a, _b, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            if (!((_a = item.page) === null || _a === void 0 ? void 0 : _a.isClosed())) {
                                                (_b = item.page) === null || _b === void 0 ? void 0 : _b.close();
                                            }
                                            if (!randomSleep) return [3 /*break*/, 2];
                                            misec = Math.floor(Math.random() * randomSleep);
                                            console.log("random wait ".concat(misec));
                                            return [4 /*yield*/, (0, index_1.sleep)(misec)];
                                        case 1:
                                            _e.sent();
                                            _e.label = 2;
                                        case 2:
                                            (_d = (_c = this.user).release) === null || _d === void 0 ? void 0 : _d.call(_c, item.id);
                                            if (force) {
                                                this.user.deleteID(item.id);
                                                this.deleteIDFile(item.id);
                                            }
                                            if (!notCreate) {
                                                item.id = this.user.newID();
                                                this.initOne(item.id).then();
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        },
                    ] };
            }
        };
        for (var _i = 0, _a = (0, index_1.shuffleArray)(this.pool); _i < _a.length; _i++) {
            var item = _a[_i];
            var state_1 = _loop_1(item);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        throw new index_1.ComError('no connection available', index_1.ComError.Status.RequestTooMany);
    };
    return BrowserPool;
}());
exports.BrowserPool = BrowserPool;
function closeOtherPages(browser, page) {
    return __awaiter(this, void 0, void 0, function () {
        var pages, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.pages()];
                case 1:
                    pages = _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < pages.length)) return [3 /*break*/, 5];
                    if (!(pages[i] !== page)) return [3 /*break*/, 4];
                    return [4 /*yield*/, pages[i].close()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.closeOtherPages = closeOtherPages;
function simplifyPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTypes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.setRequestInterception(true)];
                case 1:
                    _a.sent();
                    blockTypes = new Set([
                        'image',
                        'media',
                        'font',
                        'ping',
                        'cspviolationreport',
                    ]);
                    page.on('request', function (req) {
                        if (blockTypes.has(req.resourceType())) {
                            req.abort();
                        }
                        else {
                            req.continue();
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.simplifyPage = simplifyPage;
function simplifyPageAll(page) {
    return __awaiter(this, void 0, void 0, function () {
        var blockTypes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.setRequestInterception(true)];
                case 1:
                    _a.sent();
                    blockTypes = new Set([
                        'image',
                        'media',
                        'font',
                        'ping',
                        'cspviolationreport',
                        'stylesheet',
                        'websocket',
                        'manifest',
                    ]);
                    page.on('request', function (req) {
                        if (blockTypes.has(req.resourceType())) {
                            req.abort();
                        }
                        else {
                            req.continue();
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.simplifyPageAll = simplifyPageAll;
