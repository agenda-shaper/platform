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
exports.AcyToo = void 0;
var base_1 = require("../base");
var proxyAgent_1 = require("../../utils/proxyAgent");
var event_stream_1 = require("event-stream");
var utils_1 = require("../../utils");
var moment_1 = require("moment");
var AcyToo = /** @class */ (function (_super) {
    __extends(AcyToo, _super);
    function AcyToo(options) {
        var _this = _super.call(this, options) || this;
        _this.client = (0, proxyAgent_1.CreateAxiosProxy)({
            baseURL: 'https://chat.acytoo.com',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
                accept: '*/*',
                'Cache-Control': 'no-cache',
                'Proxy-Connection': 'keep-alive',
            },
        });
        return _this;
    }
    AcyToo.prototype.support = function (model) {
        switch (model) {
            case base_1.ModelType.GPT3p5Turbo:
                return 4000;
            default:
                return 0;
        }
    };
    AcyToo.prototype.preHandle = function (req, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, _super.prototype.preHandle.call(this, req, { token: true, countPrompt: false })];
            });
        });
    };
    AcyToo.prototype.askStream = function (req, stream) {
        return __awaiter(this, void 0, void 0, function () {
            var i, data, res_1, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 10;
                        data = {
                            temperature: 1.0,
                            model: req.model,
                            key: '',
                            messages: req.messages.map(function (v) { return (__assign(__assign({}, v), { createdAt: (0, moment_1.default)().valueOf() + i++ * 100 })); }),
                            password: '',
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.post('/api/completions', data, {
                                responseType: 'stream',
                            })];
                    case 2:
                        res_1 = _a.sent();
                        res_1.data.pipe(event_stream_1.default.map(function (chunk, cb) { return __awaiter(_this, void 0, void 0, function () {
                            var content, idx;
                            return __generator(this, function (_a) {
                                content = chunk.toString();
                                idx = content.indexOf('\n\nY');
                                if (idx > -1) {
                                    stream.write(utils_1.Event.message, { content: content.slice(0, idx) });
                                    res_1.data.destroy();
                                    return [2 /*return*/];
                                }
                                stream.write(utils_1.Event.message, { content: chunk.toString() });
                                return [2 /*return*/];
                            });
                        }); }));
                        res_1.data.on('close', function () {
                            stream.write(utils_1.Event.done, { content: '' });
                            stream.end();
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1.message);
                        stream.write(utils_1.Event.error, { error: e_1.message });
                        stream.end();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AcyToo;
}(base_1.Chat));
exports.AcyToo = AcyToo;
