/** @jsx React.DOM */
var React = require('react');

var Cell = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func,
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        tile: React.PropTypes.string.isRequired,
        mirror: React.PropTypes.bool.isRequired
    },
    onClick: function() {
        this.props.onClick(this.props.x, this.props.y, this.props.tile)
    },
    render: function() {
        var td;
        if (this.props.mirror) {
            return (<td><img style={{opacity: 0.4}} src={tileToImageUrl[this.props.tile]} /></td>);
        } else {
            return (<td onClick={this.onClick}><img src={tileToImageUrl[this.props.tile]} /></td>);
        }


    }
});

var OPEN = '.';
var MINE = '3';
var ENCAMP = '@';
var tiles = [OPEN, MINE, ENCAMP];
var tileToImageUrl = {};
tileToImageUrl[OPEN] = 'static/images/open.png';
tileToImageUrl[MINE] = 'static/images/mine.png';
tileToImageUrl[ENCAMP] = 'static/images/encampment.png';


function xAxis(x, y, height, width) {
    return !(y < (height / 2) + 1);
}

function yAxis(x, y, height, width) {
    return !(x < (width / 2) + 1);
}

var MapEditor = React.createClass({
    propTypes: {
        symmetry: React.PropTypes.string.isRequired,
        height: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired
        //tiles: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        var map = [];
        for (var i = 0; i < this.props.width; i++) {
            map.push([]);
            for (var j = 0; j < this.props.height; j++) {
                map[i].push(OPEN);
            }
        }
        var mirror = xAxis;
        return ({
            isMirror: mirror,
            map: map
        })
    },
    handleCellClick: function(x, y, tileType) {
        var map = this.state.map;
        var tileIndex = (tiles.indexOf(tileType) + 1) % 3;
        map[x][y] = tiles[tileIndex];
        this.setState({map: map});
    },
    render: function() {
        var tableContents = [];
        for (var i = 0; i < this.props.width; i++) {
            var cells = [];
            for (var j = 0; j < this.props.height; j++) {
                console.log(i, j, this.state.isMirror(i, j, this.state.height, this.state.width));
                if (this.state.isMirror(i, j, this.props.height, this.props.width)) {
                    cells.push(<Cell x={i} y={j} mirror={true} tile={this.state.map[i][j]} />);
                } else {
                    cells.push(<Cell x={i} y={j} mirror={false} onClick={this.handleCellClick} tile={this.state.map[i][j]} />);
                }
            }
            tableContents.push(<tr>{cells}</tr>);
        }
        return (
            <table>
                <tbody>
                    {tableContents}
                </tbody>
            </table>


        )
    }
});

module.exports = MapEditor;
