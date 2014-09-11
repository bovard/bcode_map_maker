/** @jsx React.DOM */
var React = require('react');

var tileToImageUrl = require('./constants').tileToImageUrl;

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
            return (<td><img style={{height: '20px', opacity: 0.65}} src={tileToImageUrl[this.props.tile]} /></td>);
        } else {
            return (<td onClick={this.onClick}><img style={{height: '20px'}} src={tileToImageUrl[this.props.tile]} /></td>);
        }


    }
});

module.exports = Cell;