import EntityCreator from "../../src/Models/EntityCreator";

beforeEach(() => {
    this.entityCreator = new EntityCreator();
});

test('Test two entities created when mixing mutable and immutable', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b><br/>')
    expect(baseContent).toBe('test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 4, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 4, 4, '<br/>', '');

});

test('Test two entities are created when surrounding normal text', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b> other test <br/>');
    expect(baseContent).toBe('test other test ');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 4, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 16, 16, '<br/>', '');
});

test('Test two entities are created immutable with content', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b><a href="test">content</a>');
    expect(baseContent).toBe('testcontent');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 4, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 4, 11, '<a>', '</a>');
});

const testEntityWithValues = (entity, startIndex, endIndex, openTag, closeTag) => {
    expect(entity.startIndex).toBe(startIndex);
    expect(entity.endIndex).toBe(endIndex);
    expect(entity.openTag).toBe(openTag);
    expect(entity.closeTag).toBe(closeTag);
};