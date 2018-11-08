import EntityMapper from "../../src/Models/EntityMapper";
import Entity from "../../src/Models/Entities/Entity";

beforeEach(() => {
    this.entityMapper = new EntityMapper();
});

test('Test update when already in mapper -> Happy Flow', () => {
    let toUpdateEntity = new Entity(
        0, 0
    );
    this.entityMapper.addEntity(toUpdateEntity);
    this.entityMapper.updateEntity(toUpdateEntity, new Entity(0, 1));

    expect(this.entityMapper).toHaveLength(1);
    expect(this.entityMapper[0].startIndex).toBe(0);
    expect(this.entityMapper[0].endIndex).toBe(1);
});

test('Test update when not in mapper', () => {
    let toUpdateEntity = new Entity(
        0, 0
    );
    this.entityMapper.updateEntity(toUpdateEntity, new Entity(0, 1));

    expect(this.entityMapper).toHaveLength(0);
});

