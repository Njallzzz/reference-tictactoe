import React from 'react';

export default function (injected) {
    const eventRouter = injected('eventRouter');
    const commandPort = injected('commandPort');
    const generateUUID = injected('generateUUID');

    class TicCell extends React.Component {
        constructor(props) {
            super(props);
            console.log(this.props);
            this.state = {
            }
        }
        componentWillMount(){
        }

        render() {
            return <div className="ticcell" onClick={() => {
              var cmdId = generateUUID();
              commandPort.routeMessage({
                  commandId:cmdId,
                  type:"PlaceMove",
                  coordinates: this.props.coordinates,
                  gameId: this.props.gameId,
                  mySide: this.props.mySide
              });
            }}>
                CELL
            </div>
        }
    }
    return TicCell;
}
