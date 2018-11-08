import EntityMapper from "../../src/Models/EntityMapper";
import Entity from "../../src/Models/Entities/Entity";

beforeEach(() => {
    this.entityMapper = new EntityMapper();
});

test('Test delete empty when already in mapper -> Happy Flow', () => {
    this.entityMapper.addEntity(new Entity(0, 0));
    this.entityMapper.removeEmptyEntities();
    expect(this.entityMapper).toHaveLength(0)
});

test('Test delete empty when not in mapper', () => {
    this.entityMapper.addEntity(new Entity(0, 1));
    this.entityMapper.removeEmptyEntities();
    expect(this.entityMapper).toHaveLength(1)
});

test('Test delete empty when multiple in mapper', () => {
    this.entityMapper.addEntity(new Entity(0, 0));
    this.entityMapper.addEntity(new Entity(1, 1));
    this.entityMapper.removeEmptyEntities();
    expect(this.entityMapper).toHaveLength(0)
});

test('Test delete empty when multiple in mapper and others', () => {
    this.entityMapper.addEntity(new Entity(0, 0));
    this.entityMapper.addEntity(new Entity(1, 1));
    this.entityMapper.addEntity(new Entity(2, 3));
    this.entityMapper.removeEmptyEntities();
    expect(this.entityMapper).toHaveLength(1);
    expect(this.entityMapper[0].startIndex).toBe(2);
    expect(this.entityMapper[0].endIndex).toBe(3);
});



