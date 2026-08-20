import { makeAutoObservable } from 'mobx'

export class CounterStore {
  count = 0
  constructor() {
    makeAutoObservable(this)
  }
  inc() {
    this.count++
  }
}
export const counterStore = new CounterStore()
