/** @jsx React.DOM */
var React = require('react');

var CreateNew = require('./CreateNew');
var MapEditor = require('./MapEditor');


React.renderComponent(
    <MapEditor height={40} width={60} symmetry={'x'} />,
    document.body
);
