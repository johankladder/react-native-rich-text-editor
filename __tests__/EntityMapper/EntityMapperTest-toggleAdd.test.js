import EntityMapper from "../../src/Models/EntityMapper";
import Entity from "../../src/Models/Entities/Entity";

beforeEach(() => {
    this.entityMapper = new EntityMapper();
});

test('Test toggleAdd when nothing already in mapper -> Happy Flow', () => {
    this.entityMapper.toggleAddEntity(new Entity(
        0, 0
    ));
    expect(this.entityMapper.length).toBe(1)
});

test('Test toggleAdd when not the same already in mapper -> Happy Flow', () => {
    this.entityMapper.addEntity(new Entity(0, 0));
    this.entityMapper.toggleAddEntity(new Entity(
        1, 1
    ));
    expect(this.entityMapper.length).toBe(2)
});

test('Test toggleAdd when same already in mapper -> So delete', () => {
    this.entityMapper.addEntity(new Entity(1, 1));
    this.entityMapper.toggleAddEntity(new Entity(
        1, 1
    ));
    expect(this.entityMapper.length).toBe(0)
});

test('Test toggleAdd when same already in mapper, and others -> So delete', () => {
    this.entityMapper.addEntity(new Entity(1, 1));
    this.entityMapper.addEntity(new Entity(2, 2));
    this.entityMapper.toggleAddEntity(new Entity(
        1, 1
    ));
    expect(this.entityMapper.length).toBe(1)
});

// TODO: Multi wrapper support
test('Test toggleAdd when same already twice, but different other fields in mapper -> So delete, keep other', () => {
    this.entityMapper.addEntity(new Entity(1, 1, 't', 't'));
    this.entityMapper.addEntity(new Entity(1, 1, 'e', 'e'));
    this.entityMapper.addEntity(new Entity(2, 2));
    this.entityMapper.toggleAddEntity(new Entity(
        1, 1, 't', 't'
    ));
    expect(this.entityMapper.length).toBe(2)
    expect(this.entityMapper[0].startIndex).toBe(1);
    expect(this.entityMapper[0].endIndex).toBe(1);
    expect(this.entityMapper[0].openTag).toBe('e');
    expect(this.entityMapper[0].closeTag).toBe('e');

    expect(this.entityMapper[1].startIndex).toBe(2);
    expect(this.entityMapper[1].endIndex).toBe(2);
});
