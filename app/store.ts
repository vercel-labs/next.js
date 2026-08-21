// Stage-3 decorator applied to an `accessor` class member.
function observable<T>(
  target: ClassAccessorDecoratorTarget<unknown, T>,
  _ctx: ClassAccessorDecoratorContext
): ClassAccessorDecoratorResult<unknown, T> {
  return target as ClassAccessorDecoratorResult<unknown, T>
}

class Store {
  @observable accessor count = 0
}

export const store = new Store()
