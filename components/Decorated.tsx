function log(target: any, key: string, descriptor: any) {
  return descriptor
}

class Thing {
  @log
  hello() {
    return 'hello from decorated class'
  }
}

export default function Decorated() {
  return <p id="decorated">{new Thing().hello()}</p>
}
