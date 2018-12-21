import EntityMapper from "./EntityMapper";
import MutableEntity from "./Entities/MutableEntity";
import parse5 from 'parse5';
import ImmutableEntity from "./Entities/ImmutableEntity";

export default class EntityCreator {

    static IMMUTABLE_TAGS = [
        'a', // <a></a> & <a/> tags are immutable in this context.
    ];

    _initialize = (richText) => {
        return {
            entityMapper: new EntityMapper(),
            baseContent: '',
            nodes: this._parseToHTMLDOM(richText),
            decrementStartIndex: 0,
        }
    };

    createFromRichText = (richText) => {
        // Initialize with starting values:
        let {entityMapper, baseContent, nodes, decrementStartIndex} = this._initialize(richText);

        nodes.forEach(node => {
            let extractedPlainContent = '';
            if (!this._isNodePlainText(node)) {

                let {baseNode, childNodes, textualContentObjects} = this._extractMultiWrappedNodes(node);

                baseNode = this._decrementCountBaseNodeEndWhenWithoutChildren(baseNode, childNodes);

                this._resolveSourceLocationChildNodesAccordingToBaseNodeWithContent(baseNode, childNodes);

                let {baseNodeEntity, childNodeEntities} = this._createEntitiesFromNodes(baseNode, childNodes);

                baseNodeEntity = entityMapper.shiftEntity(decrementStartIndex, baseNodeEntity);

                entityMapper.addEntities([baseNodeEntity, ...childNodeEntities]);

                let content = this._extractContentFromNodes(baseNode, childNodes);

                extractedPlainContent += this._createContentFromArray([...textualContentObjects, {...content}])

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

    _createContentFromArray = (contentArray) => {
        let content = '';

        let sorted = contentArray.sort((a, b) => {
            return a.startIndex - b.startIndex;
        });

        sorted.forEach(({value}) => {
            content += value
        });

        return content;

    };

    _extractMultiWrappedNodes = (node) => {

        let childNodesThatCanBeEntities = [];
        let textualContentObjects = [];

        node.childNodes.forEach(childNode => {
            if (!this._isNodePlainText(childNode)) {
                childNodesThatCanBeEntities.push(childNode)
            } else {
                textualContentObjects.push(this._createTextualContentObjectFromNode(childNode));
            }
        });

        return {
            baseNode: node,
            childNodes: childNodesThatCanBeEntities,
            textualContentObjects: textualContentObjects,
        }
    };

    _createTextualContentObjectFromNode = ({value, sourceCodeLocation}) => {
        return {
            value: value,
            startIndex: sourceCodeLocation ? sourceCodeLocation.startOffset : 0
        }
    };


    _extractContentFromNodes = (baseNode, childNodes) => {
        let allContent = '';

        if (this._isNodePlainText(baseNode)) {
            allContent = baseNode.value
        }

        let {content, contentLocation} = this._extractContentFromChildNodes(childNodes);

        allContent += content;

        return this._createTextualContentObjectFromNode({value: allContent, sourceCodeLocation: contentLocation})
    };

    _extractContentFromChildNodes = (childNodes) => {
        let content = '';
        let contentLocation = undefined;

        childNodes.forEach(childNode => {
            let possibleTextNode = childNode.childNodes[0];
            if (this._isNodePlainText(possibleTextNode)) {
                content += possibleTextNode.value;
                contentLocation = possibleTextNode.sourceCodeLocation
            }
        });

        return {
            content,
            contentLocation
        }
    };

    /**
     * Function that let the given childNodes have the same sourceCodeLocation property as the given baseNode.
     *
     * @param baseNode
     * @param childNodes
     * @return {*}
     * @private
     */
    _resolveSourceLocationChildNodesAccordingToBaseNodeWithContent = (baseNode, childNodes) => {
        childNodes.forEach((childNode) => {
            let {sourceCodeLocation} = childNode;
            let {startTag, endTag} = sourceCodeLocation;

            let decrementOffset = startTag.startOffset - (startTag.endOffset - startTag.startOffset);
            startTag.startOffset = decrementOffset > 0 ? decrementOffset : 0;

            if (endTag) {
                endTag.startOffset = endTag.startOffset - (endTag.endOffset - endTag.startCol)
            }
        });

        return childNodes;
    };

    _decrementCountBaseNodeEndWhenWithoutChildren = (baseNode, childNodes) => {
        let count = 0;
        childNodes.forEach(childNode => {
            let {sourceCodeLocation} = childNode;
            let {startTag, endTag} = sourceCodeLocation;
            count = count + (startTag.endOffset - startTag.startOffset);

            if (endTag) {
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
        if (node) {
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