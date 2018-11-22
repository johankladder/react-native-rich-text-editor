import EntityMapper from "./EntityMapper";
import MutableEntity from "./Entities/MutableEntity";
import parse5 from 'parse5';

export default class EntityCreator {

    createFromRichText = (richText) => {
        let entityMapper = new EntityMapper();
        let baseContent = '';

        let nodes = this._parseToHTMLDOM(richText);

        nodes.forEach(node => {
            if(node.nodeName !== '#text') {
                let entity = this._createEntityFromNode(node);

                entityMapper.addEntity(entity);

                baseContent += this._extractContentFromNode(node);
            } else {
                baseContent += node.value
            }
        });

        return {
            baseContent: baseContent,
            entityMapper: entityMapper
        }
    };

    _parseToHTMLDOM = (richText) => {
        return parse5.parseFragment(richText, {
            sourceCodeLocationInfo: true
        }).childNodes;
    };

    _extractContentFromNode = (node) => {
        return node.childNodes[0].value
    };

    _createEntityFromNode = (node) => {
        let {tagName, sourceCodeLocation} = node;
        let {startTag, endTag} = sourceCodeLocation;
        return new MutableEntity(
            startTag.startOffset,
            endTag.startOffset,
            "<" +  tagName + ">",
            "</" + tagName + ">"
        )
    };
}