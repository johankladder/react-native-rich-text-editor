import EntityMapper from "../../src/Models/EntityMapper";
import Entity from "../../src/Models/Entities/Entity";

beforeEach(() => {
    this.entityMapper = new EntityMapper();
});

test('Adding entity to mapper -> Happy-Flow!', () => {
    this.entityMapper.addEntity(new Entity(
        0, 0
    ));
    expect(this.entityMapper.length).toBe(1)
});

test('Adding entity to mapper -> Invalid values', () => {
    this.entityMapper.addEntity({});
    expect(this.entityMapper.length).toBe(0)
});