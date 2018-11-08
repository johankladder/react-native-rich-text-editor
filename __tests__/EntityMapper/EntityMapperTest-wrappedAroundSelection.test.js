import EntityMapper from "../../src/Models/EntityMapper";
import Entity from "../../src/Models/Entities/Entity";

beforeEach(() => {
    this.entityMapper = new EntityMapper();
});

test('Test wrappedAroundSelection when there is a entity wrapped =-> Happy Flow!', () => {
    this.entityMapper.addEntity(new Entity(0, 3))
    let result = this.entityMapper.wrappedAroundSelection({
        start: 1,
        end: 1
    });
    expect(result).toHaveLength(1);
});

test('Test wrappedAroundSelection when theres one and one not wrapped', () => {
    this.entityMapper.addEntity(new Entity(0, 3))
    this.entityMapper.addEntity(new Entity(3, 5))
    let result = this.entityMapper.wrappedAroundSelection({
        start: 1,
        end: 1
    });
    expect(result).toHaveLength(1);
});

