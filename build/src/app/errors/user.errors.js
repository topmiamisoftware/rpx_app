"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConfirmationError = void 0;
class EmailConfirmationError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = 'EmailConfirmationError'; // (2)
    }
}
exports.EmailConfirmationError = EmailConfirmationError;
//# sourceMappingURL=user.errors.js.map