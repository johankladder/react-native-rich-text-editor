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
            incrementStartIndex = incrementStartIndex + entity.openTag.length + entity.closeTag.length
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
        return entity.openTag + contentToWrap + entity.closeTag
    }
}