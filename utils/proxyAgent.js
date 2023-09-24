"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebFetchProxy = exports.WSS = exports.launchChromeAndFetchWsUrl = exports.CreateNewBrowser = exports.CreateNewPage = exports.CreateTlsProxy = exports.CreateAxiosProxy = void 0;
var axios_1 = require("axios");
var https_proxy_agent_1 = require("https-proxy-agent");
var tls_client_1 = require("tls-client");
var puppeteer_extra_1 = require("puppeteer-extra");
var puppeteer_extra_plugin_stealth_1 = require("puppeteer-extra-plugin-stealth");
var child_process_1 = require("child_process");
var ws_1 = require("ws");
var moment_1 = require("moment");
var puppeteer_1 = require("./puppeteer");
var uuid_1 = require("uuid");
var stream_1 = require("stream");
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
var reqProxy = function (config) {
    config.params = __assign(__assign({}, config.params), { target: (config.baseURL || '') + (config.url || '') });
    config.baseURL = '';
    config.url = process.env.REQ_PROXY || '';
    return config;
};
function CreateAxiosProxy(config, useReqProxy, proxy, options) {
    if (useReqProxy === void 0) { useReqProxy = true; }
    if (proxy === void 0) { proxy = true; }
    var _a = (options || {}).retry, retry = _a === void 0 ? true : _a;
    var createConfig = __assign({}, config);
    var useProxy = proxy ? process.env.http_proxy : '';
    createConfig.proxy = false;
    if (useProxy) {
        createConfig.httpAgent = (0, https_proxy_agent_1.default)(useProxy);
        createConfig.httpsAgent = (0, https_proxy_agent_1.default)(useProxy);
    }
    var client = axios_1.default.create(createConfig);
    var retryClient = axios_1.default.create(createConfig);
    if (useReqProxy && process.env.REQ_PROXY) {
        client.interceptors.request.use(function (config) {
            config.params = __assign(__assign({}, config.params), { target: (config.baseURL || '') + (config.url || '') });
            config.baseURL = '';
            config.url = process.env.REQ_PROXY || '';
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });
    }
    if (retry && process.env.RETRY === '1') {
        client.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
            // 如果请求失败并且重试次数少于一次，则重试
            if (err) {
                // 返回 axios 实例，进行一次新的请求
                console.log('axios failed, retrying!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                return retryClient(err.config);
            }
            // 如果失败且重试达到最大次数，将错误返回到用户
            return Promise.reject(err);
        });
    }
    return client;
}
exports.CreateAxiosProxy = CreateAxiosProxy;
function CreateTlsProxy(config, proxy) {
    var client = new tls_client_1.default.Session(config);
    var useProxy = process.env.http_proxy || proxy;
    if (useProxy) {
        client.proxy = useProxy;
    }
    return client;
}
exports.CreateTlsProxy = CreateTlsProxy;
function CreateNewPage(url, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, allowExtensions, _c, proxy, _d, args, browser, page;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = options || {}, _b = _a.allowExtensions, allowExtensions = _b === void 0 ? false : _b, _c = _a.proxy, proxy = _c === void 0 ? process.env.http_proxy : _c, _d = _a.args, args = _d === void 0 ? [] : _d;
                    return [4 /*yield*/, puppeteer_extra_1.default.launch({
                            headless: process.env.DEBUG === '1' ? false : 'new',
                            args: __spreadArray([
                                '--no-sandbox',
                                '--disable-setuid-sandbox',
                                "--proxy-server=".concat(proxy),
                                '--disable-background-timer-throttling',
                                '--disable-backgrounding-occluded-windows'
                            ], args, true),
                        })];
                case 1:
                    browser = _e.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _e.sent();
                    return [4 /*yield*/, page.goto(url)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
                case 4:
                    _e.sent();
                    return [2 /*return*/, page];
            }
        });
    });
}
exports.CreateNewPage = CreateNewPage;
function CreateNewBrowser() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        headless: 'new',
                        args: [
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-background-timer-throttling',
                            '--disable-backgrounding-occluded-windows',
                        ],
                    };
                    if (process.env.DEBUG === '1') {
                        options.headless = false;
                    }
                    if (process.env.http_proxy) {
                        (_a = options.args) === null || _a === void 0 ? void 0 : _a.push("--proxy-server=".concat(process.env.http_proxy));
                    }
                    return [4 /*yield*/, puppeteer_extra_1.default.launch(options)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.CreateNewBrowser = CreateNewBrowser;
var pptPort = 19222 + Math.floor(Math.random() * 10000);
function launchChromeAndFetchWsUrl() {
    pptPort += 1;
    return new Promise(function (resolve, reject) {
        var command = "".concat(process.env.CHROME_PATH);
        if (!command) {
            reject(new Error('not config CHROME_PATH in env'));
        }
        var args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            "--remote-debugging-port=".concat(pptPort),
            '--remote-debugging-address=0.0.0.0',
            '--ignore-certificate-errors',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            // `--user-data-dir=${path.join(__dirname, `${randomStr(10)}`)}`,
        ];
        if (process.env.http_proxy) {
            args.push("--proxy-server=".concat(process.env.http_proxy));
        }
        if (process.env.DEBUG !== '1') {
            args.push('--headless=new');
        }
        var chromeProcess = (0, child_process_1.spawn)(command, args);
        chromeProcess.stderr.on('data', function (data) {
            var output = data.toString();
            // Search for websocket URL
            var match = /ws:\/\/([a-zA-Z0-9\-\.]+):(\d+)\/([a-zA-Z0-9\-\/]+)/.exec(output);
            if (match) {
                console.log('found ws link');
                resolve(match[0]); // Return the full WebSocket URL
            }
        });
        chromeProcess.on('error', function (error) {
            reject(error);
        });
        chromeProcess.on('exit', function (code) {
            if (code !== 0) {
                reject(new Error("chrome exited with code ".concat(code)));
            }
        });
    });
}
exports.launchChromeAndFetchWsUrl = launchChromeAndFetchWsUrl;
var WSS = /** @class */ (function () {
    function WSS(target, callbacks) {
        var _this = this;
        this.cbMap = {};
        var _a = callbacks || {}, onOpen = _a.onOpen, onClose = _a.onClose, onMessage = _a.onMessage, onError = _a.onError;
        // 创建一个代理代理
        var wsOptions = {};
        if (process.env.http_proxy) {
            wsOptions.agent = (0, https_proxy_agent_1.default)(process.env.http_proxy || '');
        }
        // 创建一个配置了代理的 WebSocket 客户端
        var ws = new ws_1.default(target, wsOptions);
        ws.on('open', function () {
            console.log('ws open');
            onOpen && onOpen();
        });
        ws.on('close', function () {
            console.log('ws close');
            onClose && onClose();
        });
        ws.on('message', function (data, isBinary) {
            var str = data.toString('utf8');
            onMessage && onMessage(str);
            for (var _i = 0, _a = Object.values(_this.cbMap); _i < _a.length; _i++) {
                var cb = _a[_i];
                cb(str);
            }
        });
        ws.on('error', function (err) {
            console.log('ws error', err);
            onError && onError(err);
        });
        this.ws = ws;
    }
    WSS.prototype.send = function (data) {
        this.ws.send(data);
    };
    WSS.prototype.close = function () {
        this.ws.close();
    };
    WSS.prototype.onData = function (cb) {
        var _this = this;
        var key = (0, moment_1.default)().valueOf();
        this.cbMap[key] = cb;
        return function () {
            delete _this.cbMap[key];
        };
    };
    return WSS;
}());
exports.WSS = WSS;
// export function fetchWithProxy(url: string, options?: RequestInit) {
//   const initOptions: RequestInit = {};
//   if (process.env.http_proxy) {
//     initOptions.agent = HttpsProxyAgent(process.env.http_proxy || '');
//   }
//   return fetch(url, { ...initOptions, ...options });
// }
var WebFetchProxy = /** @class */ (function () {
    function WebFetchProxy(homeURL) {
        this.streamMap = {};
        this.homeURL = homeURL;
        this.init().then(function () { return console.log("web fetch proxy init ok"); });
    }
    WebFetchProxy.prototype.init = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var options, browser, _b, e_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 9]);
                        options = {
                            headless: process.env.DEBUG === '1' ? false : 'new',
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-sandbox',
                                '--disable-background-timer-throttling',
                                '--disable-backgrounding-occluded-windows',
                            ],
                        };
                        if (process.env.http_proxy) {
                            (_a = options.args) === null || _a === void 0 ? void 0 : _a.push("--proxy-server=".concat(process.env.http_proxy));
                        }
                        return [4 /*yield*/, puppeteer_extra_1.default.launch(options)];
                    case 1:
                        browser = _c.sent();
                        _b = this;
                        return [4 /*yield*/, browser.newPage()];
                    case 2:
                        _b.page = _c.sent();
                        return [4 /*yield*/, this.page.goto(this.homeURL)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, (0, puppeteer_1.closeOtherPages)(browser, this.page)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, this.page.exposeFunction('onChunk', function (id, text) {
                                var stream = _this.streamMap[id];
                                if (stream) {
                                    stream.write(text);
                                }
                            })];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, this.page.exposeFunction('onChunkEnd', function (id) {
                                var stream = _this.streamMap[id];
                                if (stream) {
                                    stream.end();
                                    delete _this.streamMap[id];
                                }
                            })];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this.page.exposeFunction('onChunkError', function (id, err) {
                                var stream = _this.streamMap[id];
                                if (stream) {
                                    stream.emit('error', err);
                                    delete _this.streamMap[id];
                                }
                            })];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_1 = _c.sent();
                        console.error('WebFetchProxy init failed, ', e_1);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    WebFetchProxy.prototype.fetch = function (url, init) {
        return __awaiter(this, void 0, void 0, function () {
            var id, stream;
            return __generator(this, function (_a) {
                if (!this.page) {
                    throw new Error('please retry wait init');
                }
                id = (0, uuid_1.v4)();
                stream = new stream_1.PassThrough();
                this.streamMap[id] = stream;
                this.page
                    .evaluate(function (id, url, init) {
                    return new Promise(function (resolve, reject) {
                        fetch(url, init)
                            .then(function (response) {
                            if (!response.body) {
                                resolve(null);
                                return null;
                            }
                            var reader = response.body.getReader();
                            function readNextChunk() {
                                reader
                                    .read()
                                    .then(function (_a) {
                                    var done = _a.done, value = _a.value;
                                    var textChunk = new TextDecoder('utf-8').decode(value);
                                    if (done) {
                                        // @ts-ignore
                                        window.onChunkEnd(id);
                                        // @ts-ignore
                                        resolve(textChunk);
                                        return;
                                    }
                                    // @ts-ignore
                                    window.onChunk(id, textChunk);
                                    readNextChunk();
                                })
                                    .catch(function (err) {
                                    // @ts-ignore
                                    window.onChunkError(id, err);
                                    reject(err);
                                });
                            }
                            readNextChunk();
                        })
                            .catch(function (err) {
                            console.error(err);
                            reject(err);
                        });
                    });
                }, id, url, init)
                    .catch(console.error);
                return [2 /*return*/, stream];
            });
        });
    };
    return WebFetchProxy;
}());
exports.WebFetchProxy = WebFetchProxy;
