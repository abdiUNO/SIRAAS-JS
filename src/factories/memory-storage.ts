import { StorageFactory } from '../types'

export default class MemoryStorageFactory implements StorageFactory {
  localStorage: Map<any, any>

  constructor() {
    this.localStorage = new Map()
  }

  set(key: any, value: any) {
    return this.localStorage.set(key, value)
  }

  get(key: any) {
    return this.localStorage.get(key) || null
  }

  delete(key: any) {
    return this.localStorage.delete(key)
  }
}
