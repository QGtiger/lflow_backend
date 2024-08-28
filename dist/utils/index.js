"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = md5;
const crypto = require("crypto");
function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
//# sourceMappingURL=index.js.map