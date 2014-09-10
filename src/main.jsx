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
            height: 50,
            width: 50,
            symmetry: constants.symmetryModes[0]
        }
    },
    render: function() {
        if (this.state.status === STATUS.INIT) {
            return (<CreateNew />);
        } else if (this.state.status === STATUS.CREATING) {
            return (<MapEditor height={40} width={60} symmetry={'x'} />);
        }

    }
});


React.renderComponent(
    <Main />,
    document.body
);
