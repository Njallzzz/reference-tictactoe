import React from 'react';
import _ from 'lodash';

export default function (injected) {
    const TictactoeBoard = injected('TictactoeBoard');

    const commandPort =injected('commandPort');
    const eventRouter =injected('eventRouter');
    const queryRouter =injected('queryRouter');

    const generateUUID = injected('generateUUID');

    const socket = injected('socket');

    class TictactoeGame extends React.Component {
        constructor() {
            super();
            this.state = {
                currentGame:{

                },
                openGames:{}
            }
        }
        //noinspection JSUnusedGlobalSymbols
        componentWillMount(){
            socket.on('userAcknowledged', (userSession)=> {
                this.setState({session: userSession});
            });

            const gameJoined = (gameJoined)=>{

                if(this.state.session.clientId === gameJoined.userSession.clientId){
                    this.setState({
                        gameOver:undefined,
                        currentGame:{
                            gameId:gameJoined.gameId,
                            side:gameJoined.side,
                            board: gameJoined.board
                        }
                    });
                }

                var openGames = this.state.openGames;
                delete openGames[gameJoined.gameId];
                this.setState({
                    openGames:openGames
                })


            };

            const gameCreated = (gameCreated)=>{
                gameJoined(gameCreated);

                var openGames = this.state.openGames;
                if(this.state.session.clientId === gameCreated.userSession.clientId){
                    // Game that I created, join & play
                    this.setState({
                        gameOver:undefined,
                        currentGame:{
                            gameId:gameCreated.gameId,
                            side:gameCreated.side,
                            board: [[1,2,3], [4,5,6], [7,8,9]]
                        }
                    });
                } else{
                    // Game that someone else created, add to open games.
                    openGames[gameCreated.gameId]=gameCreated;
                    this.setState({
                       openGames:openGames
                    });
                }
            };

            const Placed = (Placed)=>{
                if(this.state.currentGame.gameId===Placed.gameId) {
                    var newcur = this.state.currentGame;
                    newcur.board[Placed.coordinates.y][Placed.coordinates.x] = Placed.mySide;
                    this.setState({
                        invalid: undefined,
                        currentGame: newcur
                    });
                }
            };

            const invalidPlacement = (invalidPlacement)=>{
                if(this.state.currentGame.gameId===invalidPlacement.gameId) {
                    this.setState({
                        invalid: invalidPlacement
                    });
                }
            };

            const InvalidTurn = (InvalidTurn)=>{
                if(this.state.currentGame.gameId===InvalidTurn.gameId) {
                    this.setState({
                        invalid: InvalidTurn
                    });
                }
            };

            const gameOver = (gameOver)=>{

                if(this.state.currentGame.gameId===gameOver.gameId){
                    this.setState({
                        gameOver:gameOver,
                        currentGame:{

                        },
                        invalid: undefined
                    })
                }
            };

            eventRouter.on('GameJoined', gameJoined);
            eventRouter.on('GameCreated', gameCreated);
            eventRouter.on('GameWon', gameOver);
            eventRouter.on('GameDraw', gameOver);
            eventRouter.on('Placed', Placed);
            eventRouter.on('InvalidPlacement', invalidPlacement);
            eventRouter.on('InvalidTurn', InvalidTurn);

            queryRouter.on('OpenGamesResult', (resultMessage)=>{
                _.each(resultMessage.resultSet, function(event){
                    if(event.type==='GameCreated'){
                        gameCreated(event);
                    }
                });
            });
            commandPort.routeMessage({
                commandId:generateUUID(),
                type:"RequestOpenGames"
            });
        }
        createGame(){
            var cmdId = generateUUID();
            commandPort.routeMessage({
                commandId:cmdId,
                type:"CreateGame",
                gameId:generateUUID()
            });
        }
        joinGame(game){
            return ()=>{
                var cmdId = generateUUID();
                commandPort.routeMessage({
                    commandId:cmdId,
                    type:"JoinGame",
                    gameId:game.gameId
                });
            }
        }
        render() {
            var openGames = _.map(this.state.openGames, (openGame, idx)=>{
                return <div key={idx}>
                    <span>{openGame.userSession.userName}</span> <button type="button" role="button" onClick={this.joinGame(openGame)}> Join</button>
                </div>
            });

            var gameOver=undefined;
            var gameView = <div>
                <button type="button" role="button" onClick={this.createGame}>Create new game</button>
                <h2>Open games:</h2>
                {openGames}
            </div>;

            if(this.state.gameOver){
                var gameEnd;
                if(this.state.gameOver.type==='GameWon'){
                    gameEnd = <span>{this.state.gameOver.move.side} won the game!</span>
                } else {
                    gameEnd = <span>Draw!</span>
                }
                gameOver = <div>Game over: {gameEnd} </div>
            } else if(this.state.invalid) {
                if(this.state.currentGame.side === this.state.invalid.mySide) {
                    if(this.state.invalid.type === "InvalidPlacement") {
                        gameOver = <div>Invalid Move!</div>
                    } else if(this.state.invalid.type === "InvalidTurn") {
                        gameOver = <div>Not your turn!</div>
                    }
                }
            }
            if(this.state.currentGame.gameId){
                gameView = <TictactoeBoard board={this.state.currentGame.board} gameId={this.state.currentGame.gameId} mySide={this.state.currentGame.side}></TictactoeBoard>
            }
            return (<div className="TictactoeGame">
                {gameOver}
                {gameView}
            </div>);
        }
    }

    return TictactoeGame;
}
