"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = void 0;
class HttpResponse {
    constructor(httpResponse) {
        this.status = httpResponse.status;
        this.message = httpResponse.status;
        this.full_message = httpResponse.full_message;
        if (httpResponse.responseObject === '') {
            this.responseObject = '';
        }
        else {
            this.responseObject = httpResponse.responseObject;
        }
        if (httpResponse.apiKey) {
            this.apiKey = httpResponse.apiKey;
        }
    }
    httpResponse(arg0, httpResponse) {
        throw new Error('Method not implemented.');
    }
}
exports.HttpResponse = HttpResponse;
//# sourceMappingURL=http-reponse.js.map