/** @jsx React.DOM */
var React = require('react');

var Cell = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func.isRequired,
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        tile: React.PropTypes.string.isRequired
    },
    onClick: function() {
        this.props.onClick(this.props.x, this.props.y, this.props.tile)
    },
    render: function() {
        return (
            <td onClick={this.onClick}><img src={tileToImageUrl[this.props.tile]} /></td>
        );


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


var MapEditor = React.createClass({
    propTypes: {
        symmetry: React.PropTypes.string.isRequired,
        height: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired
        //tiles: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        var map = [];
        for (var i = 0; i < this.props.width / 2; i++) {
            map.push([]);
            for (var j = 0; j < this.props.height / 2; j++) {
                map[i].push(OPEN);
            }
        }
        return ({
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
        for (var i = 0; i < this.props.width / 2; i++) {
            var cells = [];
            for (var j = 0; j < this.props.height / 2; j++) {
                cells.push(<Cell x={i} y={j} onClick={this.handleCellClick} tile={this.state.map[i][j]} />);
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
