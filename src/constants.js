

var OPEN = '.';
var MINE = '3';
var ENCAMP = '@';
var A_HQ = 'a';
var B_HQ = 'b';
var tiles = [OPEN, MINE, ENCAMP];
var hqs = [A_HQ, B_HQ];
var tileToImageUrl = {};
tileToImageUrl[OPEN] = 'static/images/open.png';
tileToImageUrl[MINE] = 'static/images/mine.png';
tileToImageUrl[ENCAMP] = 'static/images/encampment.png';
tileToImageUrl[A_HQ] = 'static/images/hq1.png';
tileToImageUrl[B_HQ] = 'static/images/hq2.png';


module.exports = {
    symmetryModes: ['x-axis', 'y-axis'],
    OPEN: OPEN,
    MINE: MINE,
    ENCAMP: ENCAMP,
    A_HQ: A_HQ,
    B_HQ: B_HQ,
    tiles: tiles,
    tileToImageUrl: tileToImageUrl
};