var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

var createEvent = {
    type: "GameCreated",
    user: {
        userName: "TheGuy"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};

var joinEvent = {
    type: "GameJoined",
    user: {
        userName: "Gummi"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};


describe('create game command', function() {


    var given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){

        given = [];
        when =
        {
            id:"123987",
            type: "CreateGame",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        };
        then = [
            {
                type: "GameCreated",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side:'X'
            }
        ];

    })
});


describe('join game command', function () {
    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game joined event...', function () {

        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }
        ];
        when =
        {
            type: "JoinGame",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:30"
        };
        then = [
            {
                type: "GameJoined",
                user: {
                    userName: "Gummi"
                },
                name: "TheFirstGame",
                board:[[1,2,3],[4,5,6],[7,8,9]],
                timeStamp: "2014-12-02T11:29:30",
                side:'O'
            }
        ];

    });

    it('should emit FullGameJoinAttempted event when game full', function () {
        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "JoinGame",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }
        ];
        when =
        {
            type: "JoinGame",
            user: {
                userName: "Gamli"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        };
        then = [
            {
                type: "FullGameJoinAttempted",
                user: {
                    userName: "Gamli"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29"
            }
        ];
    })
});

describe('gameplay command', function () {

    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });

    it('should emit Placed event when PlaceMove is called', function () {
        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "JoinGame",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }
        ];
        when =
        {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 0
            },
            name: "TheFirstGame",
            mySide: 'X'
        };
        then = [
            {
                type: "Placed",
                coordinates: {
                    x: 0, y: 0
                },
                name: "TheFirstGame",
                mySide: 'X'
            }
        ];
    });

    it('should emit InvalidPlacement event when PlaceMove is called for same square', function () {
        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "JoinGame",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 0
            },
            name: "TheFirstGame",
            mySide: 'X'
        }
        ];
        when =
        {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 0
            },
            name: "TheFirstGame",
            mySide: 'O'
        };
        then = [
            {
                type: "InvalidPlacement",
                coordinates: {
                    x: 0, y: 0
                },
                name: "TheFirstGame",
                mySide: 'O'
            }
        ];
    });

    it('should emit InvalidTurn event when PlaceMove is called when it\'s not their turn', function () {
        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "JoinGame",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 0
            },
            name: "TheFirstGame",
            mySide: 'X'
        }
        ];
        when =
        {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 1
            },
            name: "TheFirstGame",
            mySide: 'X'
        };
        then = [
            {
                type: "InvalidTurn",
                coordinates: {
                    x: 0, y: 1
                },
                name: "TheFirstGame",
                mySide: 'X'
            }
        ];
    });

    it('should emit gameWon when a user wins', function () {
        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "JoinGame",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 0
            },
            name: "TheFirstGame",
            mySide: 'X'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 1, y: 0
            },
            name: "TheFirstGame",
            mySide: 'O'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 1
            },
            name: "TheFirstGame",
            mySide: 'X'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 1, y: 1
            },
            name: "TheFirstGame",
            mySide: 'O'
        } ];
        when =
        {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 2
            },
            name: "TheFirstGame",
            mySide: 'X'
        };
        then = [
            {
                type:"Placed",
                coordinates:{"x":0,"y":2},
                name:"TheFirstGame",
                mySide:"X"
            }, {
                type: "GameWon",
                name: "TheFirstGame",
                move: {side: "Unknown user"}
            }
        ];
    });

    it('should emit gameDraw when the board is full', function () {
        given = [{
            type: "GameCreated",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "JoinGame",
            user: {
                userName: "Gummi"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        }, {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 0
            },
            name: "TheFirstGame",
            mySide: 'X'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 1, y: 0
            },
            name: "TheFirstGame",
            mySide: 'O'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 2, y: 0
            },
            name: "TheFirstGame",
            mySide: 'X'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 1
            },
            name: "TheFirstGame",
            mySide: 'O'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 1, y: 1
            },
            name: "TheFirstGame",
            mySide: 'X'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 0, y: 2
            },
            name: "TheFirstGame",
            mySide: 'O'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 2, y: 1
            },
            name: "TheFirstGame",
            mySide: 'X'
        } , {
            type: "PlaceMove",
            coordinates: {
                x: 2, y: 2
            },
            name: "TheFirstGame",
            mySide: 'O'
        } ];
        when =
        {
            type: "PlaceMove",
            coordinates: {
                x: 1, y: 2
            },
            name: "TheFirstGame",
            mySide: 'X'
        } ;
        then = [
            {
                type:"Placed",
                coordinates:{"x":1,"y":2},
                name:"TheFirstGame",
                mySide:"X"
            }, {
                type: "GameDraw",
                name: "TheFirstGame"
            }
        ];
    });
});
