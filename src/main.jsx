/** @jsx React.DOM */
var React = require('react');

var CreateNew = require('./CreateNew');
var MapEditor = require('./MapEditor');

var STATUS = {
    INIT: 'init',
    CREATING: 'creating',
    VIEWING: 'viewing'
};

var constants = require('./constants');

var Main = React.createClass({
    getInitialState: function() {
        return {
            status: STATUS.INIT,
            height: 0,
            width: 0,
            symmetry: constants.symmetryModes[0]
        }
    },
    createNewMap: function(height, width, symmetry, name, mirrored) {
        this.setState({
            status: STATUS.CREATING,
            height: height,
            width: width,
            symmetry: symmetry,
            name: name || 'test',
            mirrored: mirrored === 'off'
        });
    },
    startOver: function() {
        this.setState(this.getInitialState());
    },
    render: function() {
        if (this.state.status === STATUS.INIT) {
            return (<CreateNew createMap={this.createNewMap} />);
        } else if (this.state.status === STATUS.CREATING) {
            return (
                <MapEditor
                    startOver={this.startOver}
                    height={this.state.height}
                    width={this.state.width}
                    name={this.state.name}
                    symmetry={this.state.symmetry}
                    mirrored={this.state.mirrored}  />);
        }
    }
});


React.renderComponent(
    <Main />,
    document.body
);
