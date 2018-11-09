import Entity from "./Entity";

export default class ImmutableEntity extends Entity {

    constructor(startIndex, endIndex, openTag = '', options, closeTag = '', content = '') {
        super(startIndex, endIndex, openTag, closeTag);
        this._options = options;
        this._content = content;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    /**
     * Clones this Entity (creates a new one) but increments the start- and end-index with the given
     * incrementCount.
     *
     * @param incrementCount
     * @return {Entity}
     */
    cloneEntityButIncrementIndexes = (incrementCount = 0) => {
        return new ImmutableEntity(
            this.startIndex + incrementCount,
            this.endIndex + incrementCount,
            this.openTag,
            this.options,
            this.closeTag,
            this.content
        )
    };

    getOptionsString = () => {
        let optionsString = ' ';
        Object.keys(this.options).forEach(key => {
            optionsString += (key + "=" + '\"' + this.options[key] + "\"")
        });
        return optionsString;
    }
}