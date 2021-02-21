
declare global {
  interface Date {
    toMysqlFormat(): string
  }
}

function twoDigits(d: number) {
  if (0 <= d && d < 10) return '0' + d.toString()
  if (-10 < d && d < 0) return '-0' + (-1 * d).toString()
  return d.toString()
}
Date.prototype.toMysqlFormat = function (): string {
  return (
    this.getUTCFullYear() +
    '-' +
    twoDigits(1 + this.getUTCMonth()) +
    '-' +
    twoDigits(this.getUTCDate()) +
    ' ' +
    twoDigits(this.getUTCHours()) +
    ':' +
    twoDigits(this.getUTCMinutes()) +
    ':' +
    twoDigits(this.getUTCSeconds())
  )
}

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
}

import LocalStorage from './factories/local-storage'

export interface Headers {
  [key: string]: string
}

export interface InitOptions {
  clientKey: string
  clientSecret: string
  fetch?: any
  storage: LocalStorage
  host?: string
  version?: string
  headers?: Headers
  protocol?: string
  retailer?: IRetailer
}

export interface Options {
  host: string
  version: string
  headers: Headers
  protocol: string
}

export interface AuthRequest {
  PhoneNumber: string
}

export interface StorageFactory {
  localStorage: Storage | Map<any, any>
  set(key: string, value: any): void
  get(key: any): any
  delete(key: string): void
}

export interface Fetch {
  (input?: Request | string, init?: RequestInit): Promise<Response>
}

export interface CredentialsInterface {
  clientKey: string
  consumerId: string
  accessToken: string
  refreshToken: string
  readonly isExpired: boolean
  isNewUser: boolean
  toString(): string
}

export interface IRetailer {
  RetailerID?: string
  RetailerName?: string
  RetailerType?: string
  RetailerLogo?: string
  RetailerAddress?: string
  RetailerZipCode?: string
  storeID?: string
  storeNumber?: string
}

export interface IPaymentData {
  debit?: string
  Credit?: string
  CardEntryMethod?: string
  AID?: string
  APPLLabel?: string
  ID1Temp?: string
}

export interface IPurchaseItem {
  item_id?: string | null
  itemname?: string | null
  UPC?: string | null
  internal_id?: string | null
  itemPrice?: number | null
  qty?: number | null
  color?: string | null
  size?: string | null
  weight?: string | null
  description?: string | null
  terms?: string | null
  tax?: number | null
  discount?: number | null
  subtotal?: number | null
  Total?: number | null
  taxDenominator?: string | null
  dept_type: string[] | []
}

export interface IReceiptBody extends IRetailer {
  transactionNumber?: number
  registerNumber?: number
  cashierID?: number
  storeCredit?: number
  rewardCredit?: number
  referralCredit?: number
  ratingCredit?: number
  order_date?: string
  subtotal?: number
  tax?: number
  discounts?: number
  discountsdenom?: string
  tipamounts?: number
  tipamountsdenom?: string
  total?: number
  InterfaceName: string
  billing_name?: string
  shippingAddress?: string
  itemDetails?: IPurchaseItem[]
  createPurchaseItem(config: IPurchaseItem): void
  setRetailer(retailer: IRetailer): void
}

export class GReceiptData implements IReceiptBody {
  public RetailerID: string | undefined = ''
  public RetailerName: string | undefined = ''
  public RetailerType: string | undefined = ''
  public RetailerLogo: string | undefined = ''
  public RetailerAddress: string | undefined = ''
  public RetailerZipCode: string | undefined = ''
  public storeID: string | undefined = ''
  public storeNumber: string | undefined = ''
  public transactionNumber: number | undefined = 0
  public registerNumber: number | undefined = 0
  public cashierID: number | undefined = 0
  public storeCredit: number | undefined = 0
  public rewardCredit: number | undefined = 0
  public referralCredit: number | undefined = 0
  public ratingCredit: number | undefined = 0
  public order_date: string | undefined = ''
  public subtotal: number | undefined = 0
  public tax: number | undefined = 0
  public discounts: number = 0
  public discountsdenom: string | undefined = ''
  public tipamounts: number | undefined = 0
  public tipamountsdenom: string | undefined
  public total: number | undefined = 0
  public billing_name: string | undefined = ''
  public shippingAddress: string | undefined = ''
  public itemDetails: IPurchaseItem[] | undefined
  public InterfaceName = 'KlubKangarooPrinter1'

  constructor() {
    this.order_date = new Date().toMysqlFormat()
  }

  public createPurchaseItem(config: IPurchaseItem) {
    let itemDetails = this.itemDetails

    if (itemDetails !== undefined) {
      itemDetails.push(config)
    } else {
      itemDetails = [config]
    }

    this.itemDetails = itemDetails
  }

  public setRetailer(retailer: IRetailer) {
    this.RetailerID = retailer.RetailerID
    this.RetailerName = retailer.RetailerName
    this.RetailerType = retailer.RetailerType
    this.RetailerLogo = retailer.RetailerLogo
    this.RetailerAddress = retailer.RetailerAddress
    this.RetailerZipCode = retailer.RetailerZipCode
    this.storeID = retailer.storeID
    this.storeNumber = retailer.storeNumber
  }
}

export interface IReceipt {
  addPurchaseItem(item: IPurchaseItem): void
  setConsumerID(value: string): void
  setPaymentData(paymentData: IPaymentData): void
  toJsonString(): string
}

export interface IAddReceipt {
  paymentData: IPaymentData
  items: IPurchaseItem[]
  subtotal?: number
  tax?: number
  discounts?: number
  discountsdenom?: '%' | string
  tipamounts?: number
  tipamountsdenom?: '%' | string
  total?: number
  billing_name?: string
  shippingAddress?: string
}
