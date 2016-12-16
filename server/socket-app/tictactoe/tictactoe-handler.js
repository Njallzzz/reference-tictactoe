
module.exports = function(injected){
    var TictactoeState = injected('TictactoeState');

    return function(history){

        var gameState = TictactoeState(history);

        return {
            executeCommand: function(cmd, eventHandler){

                var cmdHandlers = {
                    "CreateGame": function (cmd) {
                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameCreated",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'X'
                        }]);

                    },
                    "JoinGame": function (cmd) {
                        if(gameState.gameFull()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "FullGameJoinAttempted",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            }]);
                            return;
                        }

                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameJoined",
                            user: cmd.user,
                            name: cmd.name,
                            board: gameState.getCurrentBoard(),
                            timeStamp: cmd.timeStamp,
                            side:'O'
                        }]);
                    },
                    "PlaceMove": function(cmd){
                        if(!gameState.isTurns(cmd.mySide)) {
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "InvalidTurn",
                                coordinates: cmd.coordinates,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                mySide: cmd.mySide
                            }]);
                            return;
                        }
                        if(gameState.invalidPlacement(cmd.coordinates)) {
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "InvalidPlacement",
                                coordinates: cmd.coordinates,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                mySide: cmd.mySide
                            }]);
                            return;
                        }

                        events = [];
                        gameState.processEvents([cmd]);
                        events.push({
                            gameId: cmd.gameId,
                            type: "Placed",
                            coordinates: cmd.coordinates,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            mySide: cmd.mySide
                        });

                        var winner = gameState.winner();
                        if(winner) {
                          events.push({
                              gameId: cmd.gameId,
                              type: "GameWon",
                              name: cmd.name,
                              move: {side: winner},
                              timeStamp: cmd.timeStamp
                          });
                        } else if(gameState.draw()){
                            events.push({
                                gameId: cmd.gameId,
                                type: "GameDraw",
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            });
                        }
                        eventHandler(events);
                    }
                };

                if(!cmdHandlers[cmd.type]){
                    throw new Error("I do not handle command of type " + cmd.type)
                }
                cmdHandlers[cmd.type](cmd);
            }
        }
    }
};
