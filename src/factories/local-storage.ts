import { StorageFactory } from '../types'

export default class LocalStorage implements StorageFactory {
  localStorage: Storage

  constructor() {
    this.localStorage = localStorage
  }

  set(key: any, value: any) {
    if (typeof value === 'string') {
      return this.localStorage.setItem(key, value)
    }
      return this.localStorage.setItem(key, JSON.stringify(value))
  }

  get(key: any) {
    const value = this.localStorage.getItem(key) || null

    if (value) return JSON.parse(value)
    else return null
  }

  delete(key: any) {
    return this.localStorage.delete(key)
  }
}
