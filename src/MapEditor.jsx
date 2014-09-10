/** @jsx React.DOM */
var React = require('react');

var Cell = React.CreateClass({
    render: function() {
        return (
            <td><img src="" /></td>
        );


    }
});


var MapEditor = React.createClass({
    propTypes: {
        symmetry: React.PropTypes.string.isRequired,
        height: React.PropTypes.number.isRequired,
        width: React.PropTypes.number.isRequired,
        tiles: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        return ({



        })
    },
    handleClick: function(x, y) {

    }
});

module.exports = MapEditor;
