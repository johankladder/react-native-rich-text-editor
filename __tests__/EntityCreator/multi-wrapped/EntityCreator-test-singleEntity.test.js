import EntityCreator from "../../../src/Models/EntityCreator";

beforeEach(() => {
    this.entityCreator = new EntityCreator();
});

// TODO: Make the indexes related to the base content.

test('Test one entity created when one supported is found', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b><i>test</i></b>')
    expect(baseContent).toBe('test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 4, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 0, 4, '<i>', '</i>');
});

test('Test one entity created when one is found and other content', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b><i>test</i></b> other test');
    expect(baseContent).toBe('test other test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 4, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 0, 4, '<i>', '</i>');
});

test('Test one entity created when one is found and other content in front', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('other test <b><i>test</i></b>');
    expect(baseContent).toBe('other test test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 11, 15, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 11, 15, '<i>', '</i>');
});

test('Test one entity created when one is found and others around', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('other test <b><i>test</i></b> other test');
    expect(baseContent).toBe('other test test other test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 11, 15, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 11, 15, '<i>', '</i>');
});

const testEntityWithValues = (entity, startIndex, endIndex, openTag, closeTag) => {
    expect(entity.startIndex).toBe(startIndex);
    expect(entity.endIndex).toBe(endIndex);
    expect(entity.openTag).toBe(openTag);
    expect(entity.closeTag).toBe(closeTag);
};