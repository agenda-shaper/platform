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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPTransport = exports.newLogger = exports.initLog = void 0;
var path_1 = require("path");
var winston_1 = require("winston");
var index_1 = require("./index");
// @ts-ignore
var winston_transport_1 = require("winston-transport");
var dgram = require("dgram");
var logger;
var initLog = function () {
    var logDir = path_1.default.join(process.cwd(), 'run/logs');
    var transports = [];
    if (process.env.LOG_CONSOLE !== '0') {
        transports.push(new winston_1.default.transports.Console({
            format: winston_1.default.format.colorize(),
        }));
    }
    if (process.env.LOG_FILE !== '0') {
        transports.push(
        // 写入所有日志记录到 `combined.log`
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'combined.log'),
        }), 
        // 写入所有级别为 error 的日志记录和以下到 `error.log`
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'warn',
        }));
    }
    if (process.env.LOG_ELK === '1') {
        var port = +(process.env.LOG_ELK_PORT || 28777);
        var host = process.env.LOG_ELK_HOST || '';
        var node_1 = process.env.LOG_ELK_NODE || '';
        if (!host) {
            throw new Error('LOG_ELK_HOST is required');
        }
        console.log("init winston elk ".concat(host, " ").concat(port, " ").concat(node_1));
        transports.push(new UDPTransport({
            host: host,
            port: port,
            format: winston_1.default.format(function (info, opts) {
                info.node = node_1;
                return info;
            })(),
        }));
    }
    logger = winston_1.default.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 添加时间戳
        winston_1.default.format.prettyPrint(), // 打印整个日志对象
        winston_1.default.format.splat(), // 支持格式化的字符串
        winston_1.default.format.printf(function (_a) {
            var level = _a.level, message = _a.message, timestamp = _a.timestamp, site = _a.site;
            var labelStr = site ? " [".concat((0, index_1.colorLabel)(site), "]") : '';
            return "".concat(timestamp, " ").concat(level, ":").concat(labelStr, " ").concat(message); // 自定义输出格式
        })),
        transports: transports,
    });
    replaceConsoleWithWinston();
};
exports.initLog = initLog;
function replaceConsoleWithWinston() {
    var logger = newLogger();
    // 替换所有 console 方法
    console.log = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        return logger.info("".concat(msg.map(function (v) { return v.toString(); }).join(' ')));
    };
    console.error = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        return logger.error("".concat(msg.map(function (v) { return v.toString(); }).join(' ')));
    };
    console.warn = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        return logger.warn("".concat(msg.map(function (v) { return v.toString(); }).join(' ')));
    };
    console.debug = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        return logger.debug("".concat(msg.map(function (v) { return v.toString(); }).join(' ')));
    };
}
function newLogger(site) {
    return logger.child({ site: site });
}
exports.newLogger = newLogger;
var UDPTransport = /** @class */ (function (_super) {
    __extends(UDPTransport, _super);
    function UDPTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = {
            host: options.host,
            port: options.port,
        };
        _this.client = dgram.createSocket('udp4');
        _this.client.unref();
        return _this;
    }
    UDPTransport.prototype.log = function (info, callback) {
        var _this = this;
        this.sendLog(info, function (err) {
            _this.emit('logged', !err);
            callback(err, !err);
        });
    };
    UDPTransport.prototype.close = function () {
        this.client.disconnect();
    };
    UDPTransport.prototype.sendLog = function (info, callback) {
        var buffer = Buffer.from(JSON.stringify(info));
        /* eslint-disable @typescript-eslint/no-empty-function */
        this.client.send(buffer, 0, buffer.length, this.options.port, this.options.host, callback || function () { });
        /* eslint-enable @typescript-eslint/no-empty-function */
    };
    return UDPTransport;
}(winston_transport_1.default));
exports.UDPTransport = UDPTransport;
