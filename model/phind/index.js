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
exports.Phind = void 0;
var base_1 = require("../base");
var puppeteer_1 = require("../../utils/puppeteer");
var utils_1 = require("../../utils");
var uuid_1 = require("uuid");
var turndown_1 = require("turndown");
var turndownService = new turndown_1.default({ codeBlockStyle: 'fenced' }).remove('h6');
turndownService = turndownService.remove('h6');
var preText = "###### Answer | gpt-3.5 Model\n\n";
var MaxGptTimes = 4;
var TimeFormat = 'YYYY-MM-DD HH:mm:ss';
var url = 'https://www.phind.com';
var Phind = /** @class */ (function (_super) {
    __extends(Phind, _super);
    function Phind(options) {
        var _this = _super.call(this, options) || this;
        var maxSize = +(process.env.PHIND_POOL_SIZE || 0);
        _this.pagePool = new puppeteer_1.BrowserPool(maxSize, _this);
        return _this;
    }
    Phind.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.NetGpt3p5:
                return 4000;
            default:
                return 0;
        }
    };
    Phind.prototype.ask = function (req) {
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
    Phind.allowClipboard = function (browser, page) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = browser.defaultBrowserContext();
                        return [4 /*yield*/, context.overridePermissions(url, [
                                'clipboard-read',
                                'clipboard-write',
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                return Object.defineProperty(navigator, 'clipboard', {
                                    value: {
                                        //@ts-ignore
                                        writeText: function (text) {
                                            this.text = text;
                                        },
                                    },
                                });
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Phind.prototype.deleteID = function (id) { };
    Phind.prototype.newID = function () {
        return (0, uuid_1.v4)();
    };
    Phind.prototype.init = function (id, browser) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser.pages()];
                    case 1:
                        page = (_a.sent())[0];
                        return [4 /*yield*/, Phind.allowClipboard(browser, page)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.goto(url)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, utils_1.sleep)(2000)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.mb-3 > div > div > .mt-6 > .btn-primary')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, Phind.allowClipboard(browser, page)];
                    case 6:
                        _a.sent();
                        console.log('phind init ok!');
                        return [2 /*return*/, [page, { id: id }]];
                }
            });
        });
    };
    Phind.copyContent = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.waitForSelector('.row > .col-lg-8 > .container-xl > .mb-4 > .btn:nth-child(3)', { timeout: 5 * 60 * 1000 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.click('.row > .col-lg-8 > .container-xl > .mb-4 > .btn:nth-child(3)')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Phind.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, account, done, destroy, output_1, old_1, itl_1, wait, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req.prompt = req.prompt.replace(/\n/g, '|');
                        _a = this.pagePool.get(), page = _a[0], account = _a[1], done = _a[2], destroy = _a[3];
                        if (!account || !page) {
                            stream.write(utils_1.Event.error, { error: 'please retry later!' });
                            stream.end();
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 11]);
                        return [4 /*yield*/, page.waitForSelector('.col-md-10 > .container-xl > .mb-3 > .input-group > .form-control')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.click('.col-md-10 > .container-xl > .mb-3 > .input-group > .form-control')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.focus('.col-md-10 > .container-xl > .mb-3 > .input-group > .form-control')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, page.keyboard.type(req.prompt)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, page.keyboard.press('Enter')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('.col-lg-10 > .row > .col-lg-8:nth-child(4) > .container-xl > div:nth-child(1)')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, page.$('.col-lg-10 > .row > .col-lg-8:nth-child(4) > .container-xl > div:nth-child(1)')];
                    case 8:
                        output_1 = _b.sent();
                        old_1 = '';
                        itl_1 = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var content, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, (output_1 === null || output_1 === void 0 ? void 0 : output_1.evaluate(function (el) {
                                                return el.outerHTML;
                                            }))];
                                    case 1:
                                        content = _a.sent();
                                        if (old_1 !== content) {
                                            stream.write(utils_1.Event.message, {
                                                content: turndownService.turndown(content).replace(preText, ''),
                                            });
                                            old_1 = content;
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        e_2 = _a.sent();
                                        console.error(e_2.message);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }, 1000);
                        wait = function () { return __awaiter(_this, void 0, void 0, function () {
                            var text, sourcehtml, sourceText;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Phind.copyContent(page)];
                                    case 1:
                                        _a.sent();
                                        clearInterval(itl_1);
                                        return [4 /*yield*/, page.evaluate(function () { return navigator.clipboard.text; })];
                                    case 2:
                                        text = 
                                        //@ts-ignore
                                        (_a.sent()) || '';
                                        return [4 /*yield*/, (output_1 === null || output_1 === void 0 ? void 0 : output_1.evaluate(function (el) {
                                                return el.outerHTML;
                                            }))];
                                    case 3:
                                        sourcehtml = _a.sent();
                                        console.log('chat end: ', text);
                                        sourceText = turndownService
                                            .turndown(sourcehtml)
                                            .replace(preText, '');
                                        if ((0, utils_1.isSimilarity)(text, sourceText)) {
                                            stream.write(utils_1.Event.done, { content: text });
                                        }
                                        else {
                                            stream.write(utils_1.Event.done, { content: sourceText });
                                        }
                                        stream.end();
                                        done(account);
                                        return [4 /*yield*/, page.goto(url)];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        wait()
                            .then()
                            .catch(function (e) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.error(e.message);
                                        stream.write(utils_1.Event.error, { error: e.message });
                                        stream.end();
                                        return [4 /*yield*/, page.goto(url)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 11];
                    case 9:
                        e_1 = _b.sent();
                        console.error(e_1.message);
                        stream.write(utils_1.Event.error, { error: e_1.message });
                        stream.end();
                        return [4 /*yield*/, page.goto(url)];
                    case 10:
                        _b.sent();
                        return [2 /*return*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return Phind;
}(base_1.Chat));
exports.Phind = Phind;
