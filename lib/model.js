// Stand-in for a typegoose/typeorm entity class: the library reads MyClass.name
// at runtime to derive the collection/table name.
export class BrokenModel {
  constructor() {
    this.id = 1;
  }
}

export function getModelName(cls) {
  return cls.name;
}
