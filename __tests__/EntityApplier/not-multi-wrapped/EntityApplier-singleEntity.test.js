import EntityMapper from "../../../src/Models/EntityMapper";
import EntityApplier from "../../../src/Models/EntityApplier";
import Entity from "../../../src/Models/Entities/Entity";

beforeEach(() => {
    this.simpleBaseContent = 'This is test-base content!';
    this.entityApplier = new EntityApplier();
    this.entityMapper = new EntityMapper();
});

test('Test applying entity from start till end -> HappyFlow!', () => {
    testApplier(0, 26, '<entity>This is test-base content!</entity>')
});

test('Test applying entity in the center', () => {
    testApplier(8, 17, 'This is <entity>test-base</entity> content!')
});

test('Test applying entity in the end', () => {
    testApplier(18, 26, 'This is test-base <entity>content!</entity>')
});

test('Test applying entity after everything', () => {
    testApplier(30, 34, 'This is test-base content!<entity></entity>')
});

test('Test applying entity before everything', () => {
    testApplier(0, 0, '<entity></entity>This is test-base content!')
});

const testApplier = (start, end, resultString) => {
    this.entityMapper.addEntity(new Entity(start, end, '<entity>', '</entity>'));
    expect(this.entityApplier.apply(this.simpleBaseContent, this.entityMapper))
        .toBe(resultString)
};
