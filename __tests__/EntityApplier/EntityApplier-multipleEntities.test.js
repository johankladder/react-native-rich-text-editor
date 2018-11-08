import EntityMapper from "../../src/Models/EntityMapper";
import EntityApplier from "../../src/Models/EntityApplier";
import Entity from "../../src/Models/Entities/Entity";

beforeEach(() => {
    this.simpleBaseContent = 'This is test-base content!';
    this.entityApplier = new EntityApplier();
    this.entityMapper = new EntityMapper();
});

test('Test multiple entities -> HappyFlow', () => {
    testApplier([
        {
            start: 0,
            end: 4
        },
        {
            start: 18,
            end: 25
        }
    ], '<entity>This</entity> is test-base <entity>content</entity>!')
});

test('Test multiple entities in center -> HappyFlow', () => {
    testApplier([
        {
            start: 0,
            end: 4
        },
        {
            start: 8,
            end: 17
        },
        {
            start: 18,
            end: 25
        }
    ], '<entity>This</entity> is <entity>test-base</entity> <entity>content</entity>!')
});

const testApplier = (positions, resultString) => {
    positions.forEach(position => {
        let {start, end} = position
        this.entityMapper.addEntity(new Entity(start, end, '<entity>', '</entity>'));
    });
    expect(this.entityApplier.apply(this.simpleBaseContent, this.entityMapper))
        .toBe(resultString)
};
