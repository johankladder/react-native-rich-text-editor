import EntityMapper from "./EntityMapper";
import MutableEntity from "./Entities/MutableEntity";
import parse5 from 'parse5';
import ImmutableEntity from "./Entities/ImmutableEntity";

export default class EntityCreator {

    static IMMUTABLE_TAGS = [
        'a', // <a></a> & <a/> tags are immutable in this context.
    ];

    createFromRichText = (richText) => {
        let entityMapper = new EntityMapper();
        let baseContent = '';

        let nodes = this._parseToHTMLDOM(richText);

        let decrementStartIndex = 0;

        nodes.forEach(node => {
            let extractedPlainContent = '';
            if (!this._isNodePlainText(node)) {

                let entity = this._createEntityFromNode(node);

                entity = entityMapper.shiftEntity(decrementStartIndex, entity);

                entityMapper.addEntity(entity);

                extractedPlainContent = this._extractContentFromNode(node);

                decrementStartIndex = decrementStartIndex - this._getDecrementIndexForEntity(entity);
            } else {
                extractedPlainContent = node.value
            }
            baseContent += extractedPlainContent
        });

        return {
            baseContent: baseContent,
            entityMapper: entityMapper
        }
    };

    _filterRichTextWithoutDiv = (richText) => {
        return richText.replace(/^<div[^>]*>|<\/div>$/g, '')
    };

    _parseToHTMLDOM = (richText) => {
        return parse5.parseFragment(this._filterRichTextWithoutDiv(richText), {
            sourceCodeLocationInfo: true
        }).childNodes;
    };

    _extractContentFromNode = (node) => {
        if (node.childNodes.length) {
            return node.childNodes[0].value
        }
        return ''
    };

    _createEntityFromNode = (node) => {
        let {tagName, sourceCodeLocation} = node;
        let {startTag, endTag} = sourceCodeLocation;

        if (!this._isImmutableNode(node)) {
            return this._createMutableEntity(
                startTag.startOffset,
                endTag.startOffset - (endTag.endOffset - endTag.startCol),
                tagName,
                tagName
            )
        } else {
            let options = this._createOptionsFromAttributes(node);
            let content = endTag ? this._extractContentFromNode(node) : '';
            return this._createImmutableEntity(
                startTag.startOffset,
                content.length ? startTag.startOffset + content.length : startTag.startOffset,
                tagName,
                options,
                endTag ? tagName : undefined,
                content
            )
        }
    };

    _createMutableEntity = (startIndex, endIndex, openTagFix, closeTagFix) => {
        return new MutableEntity(
            startIndex,
            endIndex,
            "<" + openTagFix + ">",
            "</" + closeTagFix + ">"
        )
    };

    _createImmutableEntity = (startIndex, endIndex, openTagFix, options, endTagFix, content) => {
        return new ImmutableEntity(
            startIndex,
            endIndex,
            endTagFix ? "<" + openTagFix + ">" : "<" + openTagFix + "/>",
            options,
            endTagFix ? '</' + endTagFix + '>' : '',
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
        return EntityCreator.IMMUTABLE_TAGS.find(tag => {
            return tag === node.tagName
        })
    };

    _isNodePlainText = (node) => {
        if (node.nodeName === '#text') {
            return true;
        }
        if (node.nodeName === 'br') {
            node.value = '\n';
            return true
        }
        return false;
    };

    _getDecrementIndexForEntity = (entity) => {
        let additionalIncrement = 0;
        if (entity instanceof ImmutableEntity) {
            additionalIncrement = entity.getOptionsString().length
        }
        return entity.openTag.length + entity.closeTag.length + additionalIncrement;
    };
}