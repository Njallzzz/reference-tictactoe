var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {

        function gameFull() {
            return false;   // Debug
        }

        function processEvent(event) {
          this._push(event);
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull
        }
    };
};
