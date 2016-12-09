var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {
        history.full = false;
        history.board = [[1,2,3], [4,5,6], [7,8,9]];

        function gameFull() {
            return history.full;   // Debug
        }

        function processEvent(event) {
            // Debug
            for (var key in event) {
                if (event.hasOwnProperty(key)) {
                    if(key === "user"){
                        for (var i in event[key]) {
                            console.log(key + " -> " + event[key][i]);
                        }
                    } else
                    console.log(key + " -> " + event[key]);
                }
            }
            // ~Debug

            if(event.type === "JoinGame") {
                history.full = true;
            } else if(event.type === "PlaceMove") {
                // see where it is inthe movement and if it is a valid move
            }
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
