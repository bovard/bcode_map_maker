/** @jsx React.DOM */
var React = require('react');

var Input = require('react-bootstrap').Input;

var constants = require('./constants');

var CreateNew = React.createClass({

    handleSubmit: function() {

    },
    render: function() {
        var options = constants.symmetryModes.map(function(mode) {
            return (<option key={mode} value ={mode}>{mode}</option>);
        });
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <Input
                    type="text"
                    label="Map Width"
                    labelClassName="col-xs-2"
                    wrapperClassName="col-xs-4"
                    ref="width" />
                <Input
                    type="text"
                    label="Map Height"
                    labelClassName="col-xs-2"
                    wrapperClassName="col-xs-4"
                    ref="height" />
                <Input
                    type="select"
                    label="Symmetry"
                    labelClassName="col-xs-2"
                    wrapperClassName="col-xs-4"
                    ref="symmetry">
                    {options}
                </Input>
                <Input type="submit"
                    className="btn-success"
                    wrapperClassName="col-xs-offset-2 col-xs-1"
                    value="Create New Map" />
            </form>
        )
    }
});

module.exports = CreateNew;
