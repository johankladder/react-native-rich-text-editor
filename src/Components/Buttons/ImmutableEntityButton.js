export default class ImmutableEntityButton {
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

    get image() {
        return this._image;
    }

    constructor(contentTitle, openTag, closeTag, image, onImmutableAction) {
        this._entityInfo = {
            openTag: openTag,
            closeTag: closeTag,
        };
        this._contentTitle = contentTitle;
        this.onImmutableAction = onImmutableAction;
        this._image = image;
    }
}