import EntityCreator from "../../src/Models/EntityCreator";

beforeEach(() => {
    this.entityCreator = new EntityCreator();
});

test('Test one entity created when one supported is found', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b>')
    expect(baseContent).toBe('test');
    expect(entityMapper).toHaveLength(1);
    expect(entityMapper[0].startIndex).toBe(0);
    expect(entityMapper[0].endIndex).toBe(7);
});

test('Test one entity created when one other supported is found', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<i>test</i>')
    expect(baseContent).toBe('test');
    expect(entityMapper).toHaveLength(1);
    expect(entityMapper[0].startIndex).toBe(0);
    expect(entityMapper[0].endIndex).toBe(7);
    expect(entityMapper[0].openTag).toBe('<i>');
    expect(entityMapper[0].closeTag).toBe('</i>');
});

test('Test no entity created when not one is found', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('test');
    expect(baseContent).toBe('test');
    expect(entityMapper).toHaveLength(0);
});

test('Test one entity created when one is found and other content', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('<b>test</b> other test');
    expect(baseContent).toBe('test other test');
    expect(entityMapper).toHaveLength(1);
    expect(entityMapper[0].startIndex).toBe(0);
    expect(entityMapper[0].endIndex).toBe(7);
});

test('Test one entity created when one is found and other content in front', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('other test <b>test</b>');
    expect(baseContent).toBe('other test test');
    expect(entityMapper).toHaveLength(1);
    expect(entityMapper[0].startIndex).toBe(11);
    expect(entityMapper[0].endIndex).toBe(18);
});

test('Test one entity created when one is found and others around', () => {
    let {baseContent, entityMapper} = this.entityCreator.createFromRichText('other test <b>test</b> other test');
    expect(baseContent).toBe('other test test other test');
    expect(entityMapper).toHaveLength(1);
    expect(entityMapper[0].startIndex).toBe(11);
    expect(entityMapper[0].endIndex).toBe(18);
});