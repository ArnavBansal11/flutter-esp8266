"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const env = (name, defaultValue) => {
    const value = process.env[name];
    if (!value) {
        if (defaultValue) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${name} is not defined`);
    }
    return value;
};
exports.env = env;
