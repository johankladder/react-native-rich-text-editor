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

                let {baseNode, childNodes, textualContent} = this._extractMultiWrappedNodes(node);

                extractedPlainContent += textualContent;

                baseNode = this._decrementCountBaseNodeEndWhenWithoutChildren(baseNode, childNodes);

                this._makeChildNodesHaveSameSourceCodeLocationAsBaseNode(baseNode, childNodes);

                let {baseNodeEntity, childNodeEntities} = this._createEntitiesFromNodes(baseNode, childNodes);

                baseNodeEntity = entityMapper.shiftEntity(decrementStartIndex, baseNodeEntity);

                entityMapper.addEntities([baseNodeEntity, ...childNodeEntities]);

                extractedPlainContent += this._extractContentFromNodes(baseNode, childNodes);

                decrementStartIndex = decrementStartIndex - this._getDecrementIndexForEntity(baseNodeEntity);
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

    _extractContentFromNodes = (baseNode, childNodes) => {
        let content = '';

        // First check if the baseNode is plainText
        if (this._isNodePlainText(baseNode)) {
            content += baseNode.value
        }

        childNodes.forEach(childNode => {
            let possibleTextNode = childNode.childNodes[0];
            if (this._isNodePlainText(possibleTextNode)) {
                content += possibleTextNode.value
            }
        });

        return content
    };

    /**
     * Function that let the given childNodes have the same sourceCodeLocation property as the given baseNode.
     *
     * @param baseNode
     * @param childNodes
     * @return {*}
     * @private
     */
    _makeChildNodesHaveSameSourceCodeLocationAsBaseNode = (baseNode, childNodes) => {
        childNodes.forEach((childNode) => {
            let {sourceCodeLocation} = childNode;
            let {endTag} = sourceCodeLocation;


            if(endTag) {
                sourceCodeLocation.endTag = baseNode.sourceCodeLocation.endTag
            }
            sourceCodeLocation.startTag = baseNode.sourceCodeLocation.startTag
        });

        return childNodes;
    };

    _decrementCountBaseNodeEndWhenWithoutChildren = (baseNode, childNodes) => {
        let count = 0;
        childNodes.forEach(childNode => {
            let {sourceCodeLocation} = childNode;
            let {startTag, endTag} = sourceCodeLocation;
            count = count + (startTag.endOffset - startTag.startOffset);

            if(endTag) {
                count = count + (endTag.endOffset - endTag.startOffset);
            }
        });

        let {sourceCodeLocation} = baseNode;
        let {endTag} = sourceCodeLocation;

        // Immutable doesnt have a endtag
        if (endTag) {
            endTag.startOffset = endTag.startOffset - count;
            endTag.endOffset = endTag.endOffset - count;
            endTag.startCol = endTag.startCol - count;
        }
        return baseNode;

    };

    _extractMultiWrappedNodes = (node) => {

        let childNodesThatCanBeEntities = [];
        let textualContent = '';

        node.childNodes.forEach(childNode => {
            if (!this._isNodePlainText(childNode)) {
                childNodesThatCanBeEntities.push(childNode)
            } else {
                textualContent = childNode.value;
            }
        });

        return {
            baseNode: node,
            childNodes: childNodesThatCanBeEntities,
            textualContent: textualContent
        }
    };

    _createEntitiesFromNodes = (baseNode, childNodes) => {
        return {
            baseNodeEntity: this._createEntityFromNode(baseNode),
            childNodeEntities: this._createEntitiesFromChildNodes(childNodes),
        }
    };

    /**
     * Creates entities from childNodes when they are not plainText.
     *
     * @param childNodes
     * @return {Array}
     * @private
     */
    _createEntitiesFromChildNodes = (childNodes) => {
        let entities = [];

        childNodes.forEach(childNode => {
            if (!this._isNodePlainText(childNode)) {
                entities.push(this._createEntityFromNode(childNode))
            }
        });

        return entities;
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
        if(node) {
            if (node.nodeName === '#text') {
                return true;
            }
            if (node.nodeName === 'br') {
                node.value = '\n';
                return true
            }
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