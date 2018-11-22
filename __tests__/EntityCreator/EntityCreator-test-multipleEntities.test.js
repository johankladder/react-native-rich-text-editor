import EntityCreator from "../../src/Models/EntityCreator";

beforeEach(() => {
    this.entityCreator = new EntityCreator();
});

test('Test two entities created when found and after each other', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b><b>test</b>')
    expect(baseContent).toBe('testtest');
    expect(entityMapper).toHaveLength(2);
    expect(entityMapper[0].startIndex).toBe(0);
    expect(entityMapper[0].endIndex).toBe(7);
    expect(entityMapper[1].startIndex).toBe(11);
    expect(entityMapper[1].endIndex).toBe(18);

});

test('Test two entity created , but with two different tags', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<i>test</i><b>test</b>')
    expect(baseContent).toBe('testtest');
    expect(entityMapper).toHaveLength(2);
    expect(entityMapper[0].startIndex).toBe(0);
    expect(entityMapper[0].endIndex).toBe(7);
    expect(entityMapper[0].openTag).toBe('<i>');
    expect(entityMapper[0].closeTag).toBe('</i>');
    expect(entityMapper[1].startIndex).toBe(11);
    expect(entityMapper[1].endIndex).toBe(18);
    expect(entityMapper[1].openTag).toBe('<b>');
    expect(entityMapper[1].closeTag).toBe('</b>');
});

test('Test two entities are created when surrounding normal text', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b> other test <b>test</b>');
    expect(baseContent).toBe('test other test test');
    expect(entityMapper).toHaveLength(2);
    expect(entityMapper[0].startIndex).toBe(0);
    expect(entityMapper[0].endIndex).toBe(7);
    expect(entityMapper[1].startIndex).toBe(23);
    expect(entityMapper[1].endIndex).toBe(30);
});

test('Test two entities created when text is in front', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('other test <b>test</b><b>test</b>');
    expect(baseContent).toBe('other test testtest');
    expect(entityMapper).toHaveLength(2);
    expect(entityMapper[0].startIndex).toBe(11);
    expect(entityMapper[0].endIndex).toBe(18);
    expect(entityMapper[1].startIndex).toBe(22);
    expect(entityMapper[1].endIndex).toBe(29);
});

test('Test two entities are created when surrounding by other text', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('other test <b>test</b><b>test</b> other test');
    expect(baseContent).toBe('other test testtest other test');
    expect(entityMapper).toHaveLength(2);
    expect(entityMapper[0].startIndex).toBe(11);
    expect(entityMapper[0].endIndex).toBe(18);
    expect(entityMapper[1].startIndex).toBe(22);
    expect(entityMapper[1].endIndex).toBe(29);
});