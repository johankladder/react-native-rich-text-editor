import EntityCreator from "../../src/Models/EntityCreator";

beforeEach(() => {
    this.entityCreator = new EntityCreator();
});

/**
 * Only open tag -> So there is no content inside the immutable tag
 */

test('Test one immutable entity created when one supported is found', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<a href="test"/>');
    expect(baseContent).toBe(''); // As there is no actual content to be displayed
    expect(entityMapper).toHaveLength(1);
    testEntityWithValues(entityMapper[0], 0, 0, '<a/>', {href: 'test'});
});

test('Test one immutable entity created when no options', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<a/>')
    expect(baseContent).toBe('');
    expect(entityMapper).toHaveLength(1);
    testEntityWithValues(entityMapper[0], 0, 0, '<a/>', {});
});


test('Test one immutable entity created when one is found and other content', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<a href="test"/>other test');
    expect(baseContent).toBe('other test');
    expect(entityMapper).toHaveLength(1);
    testEntityWithValues(entityMapper[0], 0, 0, '<a/>', {href: 'test'});
});

/**
 * With close tag, so there is content inside the immutable tag
 */

test('Test one immutable entity created with content when one is found and other content', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<a href="test">content</a> other test');
    expect(baseContent).toBe('content other test');
    expect(entityMapper).toHaveLength(1);
    testEntityWithValues(entityMapper[0], 0, 22, '<a>', {href: 'test'}, '</a>', 'content');
});

test('Test one entity created with empty content (with close tag)', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<a href="test"></a> other test');
    expect(baseContent).toBe(' other test');
    expect(entityMapper).toHaveLength(1);
    testEntityWithValues(entityMapper[0], 0, 15, '<a>', {href: 'test'}, '</a>', '');
});

const testEntityWithValues = (entity, startIndex, endIndex, openTag, options, closeTag, content) => {
    expect(entity.startIndex).toBe(startIndex);
    expect(entity.endIndex).toBe(endIndex);
    expect(entity.openTag).toBe(openTag);
    expect(entity.options).toEqual(options);
    if (closeTag) {
        expect(entity.closeTag).toEqual(closeTag)
    }
    if (content) {
        expect(entity.content).toEqual(content)
    }
};