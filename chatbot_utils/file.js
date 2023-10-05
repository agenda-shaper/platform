"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileDebouncer = void 0;
var fs = require("fs");
var SyncFileDebouncer = /** @class */ (function () {
    function SyncFileDebouncer(debounceTime) {
        if (debounceTime === void 0) { debounceTime = 300; }
        this.timers = {};
        this.debounceTime = debounceTime;
    }
    SyncFileDebouncer.getInstance = function (debounceTime) {
        if (!SyncFileDebouncer.instance) {
            SyncFileDebouncer.instance = new SyncFileDebouncer(debounceTime);
        }
        return SyncFileDebouncer.instance;
    };
    SyncFileDebouncer.prototype.writeFileSync = function (file, data, options) {
        var _this = this;
        if (this.timers[file]) {
            clearTimeout(this.timers[file]);
        }
        this.timers[file] = setTimeout(function () {
            fs.writeFileSync(file, data);
            delete _this.timers[file];
        }, this.debounceTime);
    };
    return SyncFileDebouncer;
}());
// 使用示例
exports.fileDebouncer = SyncFileDebouncer.getInstance(500); // 100ms 的 debounce 时间
