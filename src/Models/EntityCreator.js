import EntityMapper from "./EntityMapper";
import MutableEntity from "./Entities/MutableEntity";
import parse5 from 'parse5';
import ImmutableEntity from "./Entities/ImmutableEntity";

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
        if(node.childNodes.length) {
            return node.childNodes[0].value
        }
        return ''
    };

    _createEntityFromNode = (node) => {
        let {tagName, sourceCodeLocation} = node;
        let {startTag, endTag} = sourceCodeLocation;

        if(!this._isImmutableNode(node)) {
            return this._createMutableEntity(
                startTag.startOffset,
                endTag.startOffset,
                tagName,
                tagName
            )
        } else {
            let options = this._createOptionsFromAttributes(node);
            return this._createImmutableEntity(
                startTag.startOffset,
                endTag ? endTag.startOffset : startTag.startOffset,
                tagName,
                options,
                endTag ? tagName : undefined,
                this._extractContentFromNode(node)
            )
        }
    };

    _createMutableEntity = (startIndex, endIndex, openTagFix, closeTagFix) => {
        return new MutableEntity(
            startIndex,
            endIndex,
            "<" +  openTagFix + ">",
            "</" + closeTagFix + ">"
        )
    };

    _createImmutableEntity = (startIndex, endIndex, openTagFix, options, endTagFix, content) => {
        return new ImmutableEntity(
            startIndex,
            endIndex,
            endTagFix ? "<" + openTagFix + ">" :"<" + openTagFix + "/>",
            options,
            endTagFix ? '</' + endTagFix + '>': '',
            content
        )
    };

    _createOptionsFromAttributes = (node) => {
        let options = {};

        node.attrs.forEach(({name, value}) => {
            options[name] = value
        });

        return options
    };

    _isImmutableNode = (node) => {
        return node.tagName === 'a'
    }
}