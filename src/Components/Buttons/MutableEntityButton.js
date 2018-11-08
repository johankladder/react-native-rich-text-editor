
export default class MutableEntityButton {
    get contentTitle() {
        return this._contentTitle;
    }

    set contentTitle(value) {
        this._contentTitle = value;
    }

    get entityInfo() {
        return this._entityInfo;
    }

    set entityInfo(value) {
        this._entityInfo = value;
    }

    constructor(contentTitle, openTag, closeTag) {
        this._entityInfo = {
            openTag: openTag,
            closeTag: closeTag,
        }
        this._contentTitle = contentTitle;
    }
}