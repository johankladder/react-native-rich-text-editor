import EntityCreator from "../../../src/Models/EntityCreator";

beforeEach(() => {
    this.entityCreator = new EntityCreator();
});

test('Test two entities created when mixing both with value before', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test<i></i></b>');
    expect(baseContent).toBe('test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 4, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 4, 4, '<i>', '</i>');
});

test('Test two entities created when mixing both last with value after', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b><i></i>test</b>');
    expect(baseContent).toBe('test');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 4, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 0, 0, '<i>', '</i>');
});

test('Test two entities created when mixing both only inner value', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b><i>inner</i></b>');
    expect(baseContent).toBe('inner');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 5, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 0, 5, '<i>', '</i>');
});

test('Test two entities created when mixing both values before and inner', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>before<i>inner</i></b>');
    expect(baseContent).toBe('beforeinner');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 11, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 6, 11, '<i>', '</i>');
});


test('Test two entities created when mixing both values inner and after', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b><i>inner</i>after</b>');
    expect(baseContent).toBe('innerafter');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 10, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 0, 5, '<i>', '</i>');
});

test('Test two entities created when mixing both values before, inner and after', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>before<i>inner</i>after</b>');
    expect(baseContent).toBe('beforeinnerafter');
    expect(entityMapper).toHaveLength(2);
    testEntityWithValues(entityMapper[0], 0, 16, '<b>', '</b>');
    testEntityWithValues(entityMapper[1], 6, 11, '<i>', '</i>');
});

const testEntityWithValues = (entity, startIndex, endIndex, openTag, closeTag) => {
    expect(entity.startIndex).toBe(startIndex);
    expect(entity.endIndex).toBe(endIndex);
    expect(entity.openTag).toBe(openTag);
    expect(entity.closeTag).toBe(closeTag);
};