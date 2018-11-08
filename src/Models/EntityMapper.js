import Entity from "./Entities/Entity";

/**
 * The EntityMapper is actually a array that can contain Entities. It can also perform complex action
 * on the entities it contain.
 */
export default class EntityMapper extends Array {

    /**
     * Function for adding an entity to the entityMapper. This function will check if it was a
     * valid Entity object.
     *
     * @param entity
     */
    addEntity = (entity) => {
        if (this._isValidEntity(entity)) this.push(entity);
    };

    /**
     * Updates a Entity with the given new Entity.
     *
     * @param entity
     * @param updatedEntity
     */
    updateEntity = (entity, updatedEntity) => {
        if (this._isValidEntity(entity) && this._isValidEntity(updatedEntity)) {
            let same = this._getSame(entity);
            if (same) this[this.indexOf(same)] = updatedEntity
        }
    };

    /**
     * Removes a Entity from this set.
     *
     * @param entity
     */
    removeEntity = (entity) => {
        this.splice(this.indexOf(entity), 1)
    };

    /**
     * Add's or deletes a Entity according if it is already in this set.
     *
     * @param entity
     */
    toggleAddEntity = (entity) => {
        if (this._isValidEntity(entity)) {
            let same = this._getSame(entity);
            if (same) {
                this.removeEntity(same);
            } else {
                this.addEntity(entity)
            }
        }
    };

    shiftEntity = (incrementStartIndex = 0, entity) => {
        if (entity) {
            return entity.cloneEntityButIncrementIndexes(
                incrementStartIndex
            )
        }
    };

    /**
     * Returns all the Entities that are wrapped around a certain start and end index.
     *
     * @param start
     * @param end
     * @return {T[]}
     */
    wrappedAroundSelection = ({start, end}) => {
        return this.filter(entity => {
            return entity.startIndex <= start && end < entity.endIndex
        })
    };

    _getSame = (entity) => {
        let same = undefined;
        this.forEach((innerEntity) => {
            if (innerEntity.startIndex === entity.startIndex && innerEntity.endIndex === entity.endIndex) {
                // TODO: Multi wrapper support
                // if (innerEntity.openTag === entity.openTag && innerEntity.closeTag === entity.closeTag) {
                //     same = innerEntity;
                // }
                same = innerEntity
            }
        });
        return same;

    };

    _isValidEntity = (entityThatCouldBeInvalid) => {
        return entityThatCouldBeInvalid instanceof Entity;
    }
}

