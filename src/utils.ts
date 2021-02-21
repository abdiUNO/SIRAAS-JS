export function removeLeadingSlash(_string: string) {
  return _string.replace(/^\/+/, '')
}

let btoa: any

if (!window) {
  btoa = (str: string): string => Buffer.from(str, 'binary').toString('base64')
} else {
  btoa = window.btoa.bind(window)
}

export { btoa }

