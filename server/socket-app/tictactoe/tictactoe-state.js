var _ = require('lodash');

module.exports = function (injected) {

    return function (history) {
        history.full = false;
        history.turn = 'X';
        history.board = [[1,2,3], [4,5,6], [7,8,9]];
        history.lastPlayed = undefined;

        function gameFull() {
            return history.full;
        }

        function getCurrentBoard() {
            return history.board;
        }

        function winner() {
            for(var i = 0; i < 3; i++) {
                var win = true;
                var comp = undefined;
                for(var j = 0; j < 3; j++) {
                    if(comp === undefined)
                        comp = history.board[i][j];
                    else if(comp !== history.board[i][j]) {
                        win = false;
                    }
                }
                if(win)
                    return history.lastPlayed;
            }
            for(var i = 0; i < 3; i++) {
                var win = true;
                var comp = undefined;
                for(var j = 0; j < 3; j++) {
                    if(comp === undefined)
                        comp = history.board[j][i];
                    else if(comp !== history.board[j][i]) {
                        win = false;
                    }
                }
                if(win)
                    return history.lastPlayed;
            }

            var win = true;
            var comp = undefined;
            for(var i = 0; i < 3; i++) {
                if(comp === undefined)
                    comp = history.board[i][i];
                else if(comp !== history.board[i][i])
                    win = false;
            }
            if(win)
                return history.lastPlayed;

            win = true;
            comp = undefined;
            for(var i = 0; i < 3; i++) {
                if(comp === undefined)
                    comp = history.board[i][2-i];
                else if(comp !== history.board[i][2-i])
                    win = false;
            }
            if(win)
                return history.lastPlayed;
            return undefined;
        }

        function draw() {
            for(var i = 0; i < 3; i++) {
                for(var j = 0; j < 3; j++) {
                    if(history.board[i][j] !== 'X' && history.board[i][j] !== 'O')
                        return false;
                }
            }
            return true;
        }

        function invalidPlacement(coords) {
            return isNaN(history.board[coords.y][coords.x]);
        }

        function isTurns(side) {
            return history.turn === side;
        }

        function processEvent(event) {
            if(event.type === "JoinGame") {
                history.full = true;
            } else if(event.type === "PlaceMove") {
                if(event._session)
                    history.lastPlayed = event._session.userName;
                else
                    history.lastPlayed = "Unknown user";
                history.board[event.coordinates.y][event.coordinates.x] = event.mySide;
                if(history.turn === 'X')
                    history.turn = 'O';
                else
                    history.turn = 'X';
            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        processEvents(history);

        return {
            processEvents: processEvents,
            gameFull: gameFull,
            invalidPlacement: invalidPlacement,
            isTurns: isTurns,
            getCurrentBoard: getCurrentBoard,
            winner: winner,
            draw: draw
        }
    };
};
