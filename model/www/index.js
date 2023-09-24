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
exports.WWW = void 0;
var base_1 = require("../base");
var utils_1 = require("../../utils");
var puppeteer_extra_1 = require("puppeteer-extra");
var puppeteer_extra_plugin_stealth_1 = require("puppeteer-extra-plugin-stealth");
var proxyAgent_1 = require("../../utils/proxyAgent");
var puppeteer_1 = require("../../utils/puppeteer");
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
var WWW = /** @class */ (function (_super) {
    __extends(WWW, _super);
    function WWW(options) {
        return _super.call(this, options) || this;
    }
    WWW.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, (0, proxyAgent_1.CreateNewBrowser)()];
                    case 1:
                        _a.browser = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WWW.prototype.newPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.browser)
                            throw new Error('browser not init');
                        return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, (0, puppeteer_1.simplifyPageAll)(page)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, page];
                }
            });
        });
    };
    WWW.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.URL:
                return 2000;
            default:
                return 0;
        }
    };
    WWW.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var page, content, maxToken, token, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.browser) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        this.logger.info('init ok');
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.newPage()];
                    case 3:
                        page = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, 8, 10]);
                        return [4 /*yield*/, page
                                .goto(req.prompt, {
                                waitUntil: 'domcontentloaded',
                                timeout: 5000,
                            })
                                .catch(function (err) { return _this.logger.error("page load failed, ", err); })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.$$eval('p, h1, h2, h3, h4, h5, h6, div, section, article, main', function (elements) {
                                var textEntries = [];
                                var textMap = new Map();
                                elements.forEach(function (element) {
                                    var tag = element.tagName.toLowerCase();
                                    var newText = element.innerText;
                                    var position = element.offsetTop; // 获取元素在页面上的垂直位置
                                    var shouldAdd = true;
                                    Array.from(textMap.keys()).forEach(function (storedText) {
                                        if (newText.includes(storedText)) {
                                            if (newText.length > storedText.length) {
                                                textMap.delete(storedText);
                                            }
                                            else {
                                                shouldAdd = false;
                                            }
                                        }
                                        else if (storedText.includes(newText)) {
                                            shouldAdd = false;
                                        }
                                    });
                                    if (shouldAdd) {
                                        textMap.set(newText, { tag: tag, position: position });
                                    }
                                });
                                // Convert the map to an array of entries (text, tag, and position)
                                textEntries = Array.from(textMap.entries());
                                // Sort by position (from top to bottom)
                                textEntries = textEntries.sort(function (a, b) { return a[1].position - b[1].position; });
                                // Create the final text
                                var maxText = textEntries.map(function (entry) { return entry[0]; }).join('\n');
                                // Post-processing to remove extra whitespace and newlines
                                return maxText.replace(/\s+/g, ' ').trim();
                            })];
                    case 6:
                        content = _a.sent();
                        maxToken = +(req.max_tokens || process.env.WWW_MAX_TOKEN || 2000);
                        token = (0, utils_1.getTokenSize)(content);
                        if (token > maxToken) {
                            content = content.slice(0, Math.floor((content.length * maxToken) / token));
                        }
                        stream.write(utils_1.Event.message, { content: content });
                        return [3 /*break*/, 10];
                    case 7:
                        e_1 = _a.sent();
                        this.logger.error('ask stream failed', e_1);
                        stream.write(utils_1.Event.error, { error: e_1.message });
                        return [3 /*break*/, 10];
                    case 8:
                        stream.write(utils_1.Event.done, { content: '' });
                        stream.end();
                        return [4 /*yield*/, page.close()];
                    case 9:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return WWW;
}(base_1.Chat));
exports.WWW = WWW;
