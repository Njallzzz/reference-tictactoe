var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {
        history.full = false;
        history.turn = 'X';
        history.board = [[1,2,3], [4,5,6], [7,8,9]];

        function gameFull() {
            return history.full;
        }

        function invalidPlacement(coords) {
            return isNaN(history.board[coords.y][coords.x]);
        }

        function isTurns(side) {
            return history.turn === side;
        }

        function processEvent(event) {
            // Debug
            /*console.log(event);
            for (var key in event) {
                if (event.hasOwnProperty(key)) {
                    if(typeof event[key] == "object"){
                        for (var i in event[key]) {
                          if(event[key].hasOwnProperty(i))
                            console.log(key + " -> " + i + " -> " + event[key][i]);
                        }
                    } else
                        console.log(key + " -> " + event[key]);
                }
            }
            // ~Debug */

            if(event.type === "JoinGame") {
                history.full = true;
            } else if(event.type === "PlaceMove") {
                history.board[event.coordinates.y][event.coordinates.x] = event.mySide;
                if(history.turn === 'X')
                    history.turn = 'O';
                else
                    history.turn = 'X';
            }

            // Debug
            /*console.log(history.board[0][0] + ' ' + history.board[0][1] + ' ' + history.board[0][2]);
            console.log(history.board[1][0] + ' ' + history.board[1][1] + ' ' + history.board[1][2]);
            console.log(history.board[2][0] + ' ' + history.board[2][1] + ' ' + history.board[2][2]);
            // ~Debug */
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull,
            invalidPlacement: invalidPlacement,
            isTurns: isTurns
        }
    };
};
