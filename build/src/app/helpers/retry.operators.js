"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryWithBackOff = exports.logErrorMessage = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BACKOFF = 1000;
function logErrorMessage(maxRetry, serverResponse, context = null, matDialog = null) {
    context.requestRetries = maxRetry;
    context.serverResponse = serverResponse;
    const sentryException = context.error;
    delete context.error;
    /*Sentry.withScope((scope) => {
  
          let i = 0
  
          Object.keys(context).forEach( contextKey => {
              scope.setExtra(contextKey, Object.values(context)[i])
              i++
          });
  
          Sentry.captureException(sentryException)
  
      });
  
  
      Sentry.setContext("Error Context", context)*/
    /*	if(matDialog !== null){
  
          const dialogConfig = new MatDialogConfig();
  
          dialogConfig.autoFocus = true;
          dialogConfig.panelClass = 'errorHandlerInfoPanel';
  
          let errorMessage;
  
          if(serverResponse.error != null && serverResponse.error.errors !== undefined)
              {errorMessage = Object.values(serverResponse.error.errors)[0];}
          else
              {errorMessage = context.errorMessage;}
  
          dialogConfig.data = {
              errorMessage
          };
  
          const dialogRef = matDialog.open(
            ErrorHandlerComponent,
            dialogConfig
          );
      }*/
}
exports.logErrorMessage = logErrorMessage;
function retryWithBackOff(delayMs, maxRetry = DEFAULT_MAX_RETRIES, backOffMs = DEFAULT_BACKOFF) {
    let retries = maxRetry;
    return (src) => src.pipe((0, operators_1.retryWhen)((err) => err.pipe((0, operators_1.mergeMap)(error => {
        if (retries-- > 0) {
            const backOffTime = delayMs + (maxRetry - retries) * backOffMs;
            return (0, rxjs_1.of)(error).pipe((0, operators_1.delay)(backOffTime));
        }
        return (0, rxjs_1.throwError)(error);
    }))));
}
exports.retryWithBackOff = retryWithBackOff;
//# sourceMappingURL=retry.operators.js.map