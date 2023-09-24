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
exports.You = void 0;
var uuid_1 = require("uuid");
//@ts-ignore
var user_agents_1 = require("user-agents");
var utils_1 = require("../../utils");
var base_1 = require("../base");
var proxyAgent_1 = require("../../utils/proxyAgent");
var userAgent = new user_agents_1.default();
var You = /** @class */ (function (_super) {
    __extends(You, _super);
    function You(props) {
        var _this = _super.call(this, props) || this;
        _this.session = (0, proxyAgent_1.CreateTlsProxy)({ clientIdentifier: 'chrome_108' });
        _this.session.headers = _this.getHeaders();
        return _this;
    }
    You.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.GPT3p5Turbo:
                return 2000;
            default:
                return 0;
        }
    };
    You.prototype.request = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, page, _c, count, _d, safeSearch, _e, onShoppingPage, _f, mkt, _g, responseFilter, _h, domain, _j, queryTraceId, _k, chat, _l, includeLinks, _m, detailed, _o, debug;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        _a = {}, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.count, count = _c === void 0 ? 10 : _c, _d = _a.safeSearch, safeSearch = _d === void 0 ? 'Moderate' : _d, _e = _a.onShoppingPage, onShoppingPage = _e === void 0 ? 'False' : _e, _f = _a.mkt, mkt = _f === void 0 ? '' : _f, _g = _a.responseFilter, responseFilter = _g === void 0 ? 'WebPages,Translations,TimeZone,Computation,RelatedSearches' : _g, _h = _a.domain, domain = _h === void 0 ? 'youchat' : _h, _j = _a.queryTraceId, queryTraceId = _j === void 0 ? null : _j, _k = _a.chat, chat = _k === void 0 ? [] : _k, _l = _a.includeLinks, includeLinks = _l === void 0 ? "False" : _l, _m = _a.detailed, detailed = _m === void 0 ? "False" : _m, _o = _a.debug, debug = _o === void 0 ? "False" : _o;
                        return [4 /*yield*/, this.session.get('https://you.com/api/streamingSearch', {
                                params: {
                                    q: req.prompt,
                                    page: page + '',
                                    count: count + '',
                                    safeSearch: safeSearch + '',
                                    onShoppingPage: onShoppingPage + '',
                                    mkt: mkt + '',
                                    responseFilter: responseFilter + '',
                                    domain: domain + '',
                                    queryTraceId: (0, uuid_1.v4)(),
                                    chat: JSON.stringify(chat),
                                },
                            })];
                    case 1: return [2 /*return*/, _p.sent()];
                }
            });
        });
    };
    You.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request(req)];
                    case 1:
                        response = _a.sent();
                        (0, utils_1.toEventCB)(response.content, function (eventName, data) {
                            var obj;
                            switch (eventName) {
                                case 'youChatToken':
                                    obj = (0, utils_1.parseJSON)(data, {});
                                    stream.write(utils_1.Event.message, { content: obj.youChatToken });
                                    break;
                                case 'done':
                                    stream.write(utils_1.Event.done, { content: 'done' });
                                    stream.end();
                                    return;
                                default:
                                    return;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    You.prototype.ask = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request(req)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) {
                                var res = {
                                    content: '',
                                };
                                (0, utils_1.toEventCB)(response.content, function (eventName, data) {
                                    var obj;
                                    switch (eventName) {
                                        case 'youChatToken':
                                            obj = (0, utils_1.parseJSON)(data, {});
                                            res.content += obj.youChatToken;
                                            break;
                                        case 'done':
                                            resolve(res);
                                            return;
                                        default:
                                            return;
                                    }
                                });
                            })];
                }
            });
        });
    };
    You.prototype.getHeaders = function () {
        return {
            authority: 'you.com',
            accept: 'text/event-stream',
            'accept-language': 'en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3',
            'cache-control': 'no-cache',
            referer: 'https://you.com/search?q=who+are+you&tbm=youchat',
            'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            cookie: "safesearch_guest=Moderate; uuid_guest=".concat((0, uuid_1.v4)()),
            'user-agent': userAgent.toString(),
        };
    };
    return You;
}(base_1.Chat));
exports.You = You;
