"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var fs_1 = require("fs");
var base_1 = require("../model/base");
var BaseConfig = /** @class */ (function () {
    function BaseConfig() {
        this.filePath = './run/config.json';
        this.defaultConfig = {
            perplexity: {
                cf_debug: false,
            },
            site_map: {},
            one_api: {
                base_url: '',
                api_key: '',
                proxy: false,
            },
            cursor: {
                primary_model: base_1.ModelType.GPT4,
            },
        };
        // Initialize config as a deep copy of defaultConfig
        this.config = JSON.parse(JSON.stringify(this.defaultConfig));
    }
    BaseConfig.prototype.load = function () {
        var _this = this;
        if (!(0, fs_1.existsSync)(this.filePath)) {
            // console.log(
            //   `Configuration file ${this.filePath} not found. Retrying in 5 seconds...`,
            // );
            setTimeout(function () { return _this.load(); }, 5000);
            return;
        }
        try {
            var rawData = (0, fs_1.readFileSync)(this.filePath, 'utf8');
            var fileConfig = JSON.parse(rawData);
            // Merge defaultConfig and fileConfig
            this.config = Object.assign(this.config, this.defaultConfig, fileConfig);
            console.log('Loaded config from run/config.json successfully!', JSON.stringify(this.config));
        }
        catch (error) {
            // console.error(`Error reading or parsing the configuration file ${this.filePath}.`, error);
        }
    };
    BaseConfig.prototype.watchFile = function () {
        var _this = this;
        if (!(0, fs_1.existsSync)(this.filePath)) {
            // console.log(`Configuration file ${this.filePath} not found. Retrying in 5 seconds...`);
            setTimeout(function () { return _this.watchFile(); }, 5000);
            return;
        }
        var timeoutId = null;
        var debounceDelay = 300;
        try {
            (0, fs_1.watch)(this.filePath, function (event) {
                if (event === 'change') {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    timeoutId = setTimeout(function () {
                        console.log("Configuration file ".concat(_this.filePath, " has been changed! Reloading..."));
                        _this.load();
                    }, debounceDelay);
                }
            });
        }
        catch (e) {
            console.error(e);
        }
    };
    return BaseConfig;
}());
exports.Config = new BaseConfig();
