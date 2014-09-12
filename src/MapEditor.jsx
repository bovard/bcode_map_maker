/** @jsx React.DOM */
var React = require('react');

var marked = require('marked');

var Button = require('react-bootstrap').Button;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Well = require('react-bootstrap').Well;

var Cell = require('./Cell');

var createXML = require('./createXML');
var constants = require('./constants');

var mapConstraints = [
    '### Instructions',
    '  - Click to toggle a cell',
    '  - Click and drag to toggle a bunch of cells',
    '  - Click the hq to switch, or replace',
    '### Map Constraints',
    'Official maps used in scrimmages and tournaments must all satisfy the following conditions.',
    '  - Maps are completely symmetric either by reflection or 180 degree rotation.',
    '  - The width and height of the map are guaranteed to be between 20 and 70, inclusive.',
    '  - The map cannot have neutral mines on the 4 squares orthogonally adjacent to either HQ.',
    '  - There will be a minimum of 5 encampment squares on the map.',
    '  - It will be possible for a soldier to get adjacent to the enemy HQ by turn 200, given that you only make one soldier and research/capture nothing, and the opposing team does nothing.',
    '  - The distance between the spawn points will be at least 10 units (Euclidean distance).'
];

var markedMap = marked(mapConstraints.join('\n'));


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
    PLACE_HQ: 'place_hq',
    MOUSE_DOWN: 'mouse_down'
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
    handleMouseDown: function(x, y) {
        this.setState({start: {x: x, y: y}, dragState: STATE.MOUSE_DOWN});
    },
    handleMouseUp: function(x, y) {
        if (this.state.dragState === STATE.MOUSE_DOWN) {
            this.setState({dragState: STATE.NORMAL});
            this.handleRegion(
                Math.min(this.state.start.x, x), 
                Math.min(this.state.start.y, y), 
                Math.max(this.state.start.x, x),
                Math.max(this.state.start.y, y)
            );
        }
    },
    handleRegion: function(startX, startY, endX, endY) {
        if (startX === endX && startY === endY) {
            this.handleCellClick(startX, startY, this.state.map[startX][startY]);
        } else if (this.state.state !== STATE.PLACE_HQ) {
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var tile = this.state.map[i][j];
                    if (tile !== constants.A_HQ && tile !== constants.B_HQ) {
                        this.handleCellClick(i, j, this.state.map[i][j]);
                    }
                }
            }
        }
    },
    render: function() {
        var tableContents = [];
        for (var i = 0; i < this.props.width; i++) {
            var cells = [];
            for (var j = 0; j < this.props.height; j++) {
                if (this.state.isMirror(i, j, this.props.height, this.props.width)) {
                    cells.push(<Cell x={i} y={j} mirror={true} tile={this.state.map[i][j]} />);
                } else {
                    cells.push(<Cell x={i} y={j} mirror={false} onMD={this.handleMouseDown} onMU={this.handleMouseUp} tile={this.state.map[i][j]} />);
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
                    <Col xs={12}>
                        <br />
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Button onClick={this.startOver} bsStyle="danger">Start Over</Button>
                    </Col>
                    <Col xs={6}>
                        <Button onClick={this.exportMap} bsStyle="success">Export</Button>
                    </Col>
                </Row>
                <Row>
                    <span dangerouslySetInnerHTML={{__html: markedMap}} />
                </Row>
            </Well>
        )
    }
});

module.exports = MapEditor;
