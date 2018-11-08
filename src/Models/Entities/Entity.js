/**
 * An Entity represents a editable or not editable component inside textual content. In a HTML context
 * a entity can be a {bold} component (<b></b>), but might also be a </br> component.
 *
 * The objects contains the related component information, like the opening- and close-tags. But also
 * contains the start- and end-indexes. These indexes needs to be correctly maintained when the content around
 * the Entity is changed.
 */
export default class Entity {

    /**
     * @param startIndex
     * @param endIndex
     * @param openTag
     * @param closeTag
     */
    constructor(startIndex, endIndex, openTag = '', closeTag = '') {
        this._startIndex = startIndex;
        this._endIndex = endIndex;
        this._openTag = openTag;
        this._closeTag = closeTag;
    }

    set startIndex(value) {
        this._startIndex = value;
    }

    set endIndex(value) {
        this._endIndex = value;
    }

    set openTag(value) {
        this._openTag = value;
    }

    set closeTag(value) {
        this._closeTag = value;
    }

    get startIndex() {
        return this._startIndex;
    }

    get endIndex() {
        return this._endIndex;
    }

    get openTag() {
        return this._openTag;
    }

    get closeTag() {
        return this._closeTag;
    }

    /**
     * Clones this Entity (creates a new one) but increments the start- and end-index with the given
     * incrementCount.
     *
     * @param incrementCount
     * @return {Entity}
     */
    cloneEntityButIncrementIndexes = (incrementCount = 0) => {
        return new Entity(
            this.startIndex + incrementCount,
            this.endIndex + incrementCount,
            this.openTag,
            this.closeTag
        )
    };
}