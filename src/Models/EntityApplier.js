import ImmutableEntity from "./Entities/ImmutableEntity";

export default class EntityApplier {

    apply = (baseContent, entityMapper) => {
        return this._applyEntityMapperToContent(baseContent, entityMapper)
    };

    _applyEntityMapperToContent = (content, entityMapper) => {
        let newContent = content;

        let incrementStartIndex = 0;

        entityMapper.forEach(entity => {
            entity = entityMapper.shiftEntity(incrementStartIndex, entity);
            let entityInfo = {content: newContent, entity: entity};

            newContent =
                this._leftSide(entityInfo) +
                this._wrapWithEntity(this._contentToWrap(entityInfo), entity) +
                this._rightSide(entityInfo);
            incrementStartIndex = incrementStartIndex + this._getIncrementIndexForEntity(entity)
        });

        return newContent;
    };

    _leftSide = (entityInfo) => {
        let {content, entity} = entityInfo;
        return content.substr(0, entity.startIndex)
    };

    _rightSide = (entityInfo) => {
        let {content, entity} = entityInfo;
        return content.substr(entity.endIndex)
    };

    _contentToWrap = (entityInfo) => {
        let {content, entity} = entityInfo;
        return content.substr(entity.startIndex, entity.endIndex - entity.startIndex)
    };

    _wrapWithEntity = (contentToWrap, entity) => {
        if (entity instanceof ImmutableEntity) {
            return this._wrapWithImmutableEntity(contentToWrap, entity)
        }
        return entity.openTag + contentToWrap + entity.closeTag
    };

    _wrapWithImmutableEntity = (contentToWrap, entity) => {

        let optionsString = entity.getOptionsString();

        let splitter = entity.closeTag ? ">" : "/>";

        let [first, end] = entity.openTag.split(splitter);

        return first + optionsString + splitter + end + entity.content + entity.closeTag
    };

    _getIncrementIndexForEntity = (entity) => {
        let additionalIncrement = 0;
        if (entity instanceof ImmutableEntity) {
            additionalIncrement = entity.getOptionsString().length
        }
        return entity.openTag.length + entity.closeTag.length + additionalIncrement;
    };
}