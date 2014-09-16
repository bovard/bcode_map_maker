function createXML(height, width, mapString) {
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<map height="' + width + '" width="' + height + '">',
        '    <game seed="' + parseInt(Math.random() * 1000000) + '" rounds="2000"/>',
        '    <symbols>',
        '        <symbol terrain="LAND" type="TERRAIN" character="."/>',
        '        <symbol team="NEUTRAL" type="MINE" character="3"/>',
        '        <symbol team="NEUTRAL" type="ENCAMPMENT" character="@"/>',
        '        <symbol team="A" type="HQ" character="a"/>',
        '        <symbol team="B" type="HQ" character="b"/>',
        '    </symbols>',
        '    <data>',
        '<![CDATA[',
        mapString,
        ']]>',
        '    </data>',
        '</map>'
    ].join('\n')
}

module.exports = createXML;