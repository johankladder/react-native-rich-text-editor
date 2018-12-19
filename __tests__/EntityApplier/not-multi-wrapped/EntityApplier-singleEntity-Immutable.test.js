import EntityMapper from "../../../src/Models/EntityMapper";
import EntityApplier from "../../../src/Models/EntityApplier";
import Entity from "../../../src/Models/Entities/Entity";
import ImmutableEntity from "../../../src/Models/Entities/ImmutableEntity";

beforeEach(() => {
    this.simpleBaseContent = 'This is test-base content!';
    this.entityApplier = new EntityApplier();
    this.entityMapper = new EntityMapper();
});

/**
 * Only open tag
 */
test('Test applying entity at start -> HappyFlow!', () => {
    testApplier(0, 0, {href: 'test'}, '<entity href="test"/>This is test-base content!')
});

test('Test applying entity in the center', () => {
    testApplier(8, 8, {href: 'test'}, 'This is <entity href="test"/>test-base content!')
});

test('Test applying entity after everything', () => {
    testApplier(30, 30, {href: 'test'}, 'This is test-base content!<entity href="test"/>')
});

/**
 * Open and close tag
 */
test('Test applying entity at start (open and close) -> HappyFlow!', () => {
    testApplierWithCloseTag(0, 0, {href: 'test'}, '<entity href="test"></entity>This is test-base content!')
});

test('Test applying entity in the center, with content', () => {
    testApplierWithCloseTag(8, 8, {href: 'test'}, 'This is <entity href="test">link</entity>test-base content!', 'link')
});

test('Test applying entity after everything with content', () => {
    testApplierWithCloseTag(30, 30, {href: 'test'}, 'This is test-base content!<entity href="test">link</entity>', 'link')
});

const testApplier = (start, end, options, resultString) => {
    this.entityMapper.addEntity(new ImmutableEntity(start, end,  '<entity/>', options));
    expect(this.entityApplier.apply(this.simpleBaseContent, this.entityMapper))
        .toBe(resultString)
};

const testApplierWithCloseTag = (start, end, options, resultString, content) => {
    this.entityMapper.addEntity(new ImmutableEntity(start, end,  '<entity>', options, '</entity>', content));
    expect(this.entityApplier.apply(this.simpleBaseContent, this.entityMapper))
        .toBe(resultString)
};
