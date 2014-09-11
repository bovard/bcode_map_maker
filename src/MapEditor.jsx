/** @jsx React.DOM */
var React = require('react');

var Button = require('react-bootstrap').Button;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Well = require('react-bootstrap').Well;

var Cell = require('./Cell');

var createXML = require('./createXML');
var constants = require('./constants');

function yAxis(x, y, height, width) {
    return !(y < (height / 2));
}

function yAxisMirrorCell(x, y, height, width) {
    console.log('here', y);
    if (y < height / 2) {
        y = height - y - 1;
    }
    return [[x, y]];
}

function xAxis(x, y, height, width) {
    return !(x < (width / 2));
}

function xAxisMirrorCell(x, y, height, width) {
    if (x < width / 2) {
        x = width - x - 1;
    }
    return [[x, y]];
}


function diag(x, y, height, width) {
    return (y > x);
}

function diagMirrorCell(x, y, height, width) {
    return [[y, x]];
}

function reverseDiag(x, y, height, width) {
    return !(x + y < height);
}

function reverseDiagMirrorCell(x, y, height, width) {
    return [[height - y - 1, width - x - 1]];

}

var STATE = {
    NORMAL: 'normal',
    PLACE_HQ: 'place_hq'
};

var MapEditor = React.createClass({
    propTypes: {
        symmetry: React.PropTypes.string.isRequired,
        height: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        startOver: React.PropTypes.func.isRequired
        //tiles: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        var map = [];
        for (var i = 0; i < this.props.width; i++) {
            map.push([]);
            for (var j = 0; j < this.props.height; j++) {
                map[i].push(constants.OPEN);
            }
        }
        var mirror = xAxis;
        var mirrorCell = xAxisMirrorCell;
        if (this.props.symmetry === constants.symmetryModes[1]) {
            mirror = yAxis;
            mirrorCell = yAxisMirrorCell;
        } else if (this.props.symmetry === constants.symmetryModes[2]) {
            mirror = diag;
            mirrorCell = diagMirrorCell;
        } else if (this.props.symmetry === constants.symmetryModes[3]) {
            mirror = reverseDiag;
            mirrorCell = reverseDiagMirrorCell;
        }
        map[5][1] = 'a';
        var b = mirrorCell(5, 1, this.props.height, this.props.width)[0];
        map[b[0]][b[1]] = 'b';
        return ({
            isMirror: mirror,
            mirrorCell: mirrorCell,
            state: STATE.NORMAL,
            map: map
        })
    },
    getNextTiles: function(tile) {
        if (this.state.state === STATE.PLACE_HQ) {
            this.setState({
                state: STATE.NORMAL
            });
            return [constants.A_HQ, constants.B_HQ];
        }
        else if (tile === constants.B_HQ) {
            this.setState({
                state: STATE.PLACE_HQ
            });
            return [constants.OPEN, constants.OPEN];
        }
        else if (tile === constants.A_HQ) {
            return [constants.B_HQ, constants.A_HQ];
        }
        else {
            var nextTileIndex = (constants.tiles.indexOf(tile) + 1) % 3;
            var nextTile = constants.tiles[nextTileIndex];
            return [nextTile, nextTile];
        }
    },
    handleCellClick: function(x, y, tileType) {
        var map = this.state.map;
        var nextTiles = this.getNextTiles(tileType);
        map[x][y] = nextTiles[0];

        var mirrors = this.state.mirrorCell(x, y, this.props.height, this.props.width);
        mirrors.forEach(function(cell) {
            map[cell[0]][cell[1]] = nextTiles[1];
        }.bind(this));

        this.setState({map: map});
    },
    getMapString: function() {
        var rows = [];
        for (var i = 0; i < this.props.width; i++) {
            var row = '';
            for (var j = 0; j < this.props.height; j++) {
                row += this.state.map[i][j];
            }
            rows.push(row)
        }
        return rows.join('\n');
    },
    exportMap: function() {
        var mapString = this.getMapString();
        var mapFile = createXML(this.props.height, this.props.width, mapString);
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(mapFile));
        pom.setAttribute('download', this.props.name + '.xml');
        pom.click();
    },
    startOver: function() {
        this.props.startOver();
    },
    render: function() {
        var tableContents = [];
        for (var i = 0; i < this.props.width; i++) {
            var cells = [];
            for (var j = 0; j < this.props.height; j++) {
                if (this.state.isMirror(i, j, this.props.height, this.props.width)) {
                    cells.push(<Cell x={i} y={j} mirror={true} tile={this.state.map[i][j]} />);
                } else {
                    cells.push(<Cell x={i} y={j} mirror={false} onClick={this.handleCellClick} tile={this.state.map[i][j]} />);
                }
            }
            tableContents.push(<tr>{cells}</tr>);
        }
        return (
            <Well>
                <table>
                    <tbody>
                        {tableContents}
                    </tbody>
                </table>
                <Row>
                    <Col xs={6}>
                        <Button onClick={this.startOver} bsStyle="danger">Start Over</Button>
                    </Col>
                    <Col xs={6}>
                        <Button onClick={this.exportMap} bsStyle="success">Export</Button>
                    </Col>
                </Row>
            </Well>
        )
    }
});

module.exports = MapEditor;
