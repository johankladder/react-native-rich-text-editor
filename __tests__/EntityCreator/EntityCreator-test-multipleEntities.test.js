import EntityCreator from "../../src/Models/EntityCreator";

beforeEach(() => {
    this.entityCreator = new EntityCreator();
});

test('Test two entities created when found and after each other', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b><b>test</b>')
    expect(baseContent).toBe('testtest');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 7, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 11, 18, '<b>', '</b>');

});

test('Test two entity created , but with two different tags', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<i>test</i><b>test</b>')
    expect(baseContent).toBe('testtest');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 7, '<i>', '</i>');
    testEntityWithValues(entityMapper[1], 11, 18, '<b>', '</b>');
});

test('Test two entities are created when surrounding normal text', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b> other test <b>test</b>');
    expect(baseContent).toBe('test other test test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 7, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 23, 30, '<b>', '</b>');
});

test('Test two entities created when text is in front', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('other test <b>test</b><b>test</b>');
    expect(baseContent).toBe('other test testtest');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 11, 18, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 22, 29, '<b>', '</b>');
});

test('Test two entities are created when surrounding by other text', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('other test <b>test</b><b>test</b> other test');
    expect(baseContent).toBe('other test testtest other test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 11, 18, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 22, 29, '<b>', '</b>');
});

const testEntityWithValues = (entity, startIndex, endIndex, openTag, closeTag) => {
    expect(entity.startIndex).toBe(startIndex);
    expect(entity.endIndex).toBe(endIndex);
    expect(entity.openTag).toBe(openTag);
    expect(entity.closeTag).toBe(closeTag);
};