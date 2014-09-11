/** @jsx React.DOM */
var React = require('react');

var Input = require('react-bootstrap').Input;
var Well = require('react-bootstrap').Well;

var constants = require('./constants');

var CreateNew = React.createClass({
    propTypes: {
        createMap: React.PropTypes.func.isRequired
    },
    handleSubmit: function() {
        this.props.createMap(
            parseInt(this.refs.width.getValue()),
            parseInt(this.refs.height.getValue()),
            this.refs.symmetry.getValue(),
            this.refs.name.getValue()
        );
        return false;
    },
    render: function() {
        var options = constants.symmetryModes.map(function(mode) {
            return (<option key={mode} value ={mode}>{mode}</option>);
        });
        var hSizeOptions = [];
        var wSizeOptions = [];
        for (var i = 20; i <=70; i++) {
            hSizeOptions.push(<option key={'h' + i} value={i}>{i}</option>);
            wSizeOptions.push(<option key={'w' + i} value={i}>{i}</option>);
        }
        return (
            <Well>
            <h2>Welcome to BattleCode Map Maker!</h2>
            <br />
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <Input
                    type="text"
                    label="Map Name"
                    labelClassName="col-xs-2"
                    wrapperClassName="col-xs-4"
                    ref="name" />
                <Input
                    type="select"
                    label="Map Width"
                    labelClassName="col-xs-2"
                    wrapperClassName="col-xs-4"
                    ref="width">
                    {wSizeOptions}
                </Input>
                <Input
                    type="select"
                    label="Map Height"
                    labelClassName="col-xs-2"
                    wrapperClassName="col-xs-4"
                    ref="height">
                    {hSizeOptions}
                </Input>
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
                    wrapperClassName="col-xs-offset-2 col-xs-2"
                    value="Create New Map" />
            </form>
            </Well>
        )
    }
});

module.exports = CreateNew;
