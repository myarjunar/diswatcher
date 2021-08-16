const parser = require('fast-xml-parser');
const he = require('he');

const options = {
  attributeNamePrefix : "@_",
  attrNodeName: "attr",
  textNodeName : "#text",
  ignoreAttributes : true,
  ignoreNameSpace : false,
  allowBooleanAttributes : false,
  parseNodeValue : true,
  parseAttributeValue : false,
  trimValues: true,
  cdataTagName: "__cdata",
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: false,
  arrayMode: false,
  attrValueProcessor: (val) => he.decode(val, {isAttributeValue: true}),
  tagValueProcessor : (val) => he.decode(val),
  stopNodes: ["parse-me-as-string"]
};

const xmlParser = () => {
  class XmlParser {
    static parse(xmlData) {
      return parser.parse(xmlData, options);
    }
  }

  return XmlParser;
};

module.exports = xmlParser();
