import {
  IPaymentData,
  IRetailer,
  IPurchaseItem,
  IReceipt,
  IReceiptBody,
  GReceiptData,
  IAddReceipt,
} from './types'
import { v4 as uuidv4 } from 'uuid'

class Receipt implements IReceipt {
  protected _ConsumerID: string | undefined
  private _GReceiptData: IReceiptBody = new GReceiptData()
  protected _PaymentData: IPaymentData = {}

  addPurchaseItem(item: IPurchaseItem) {
    this._GReceiptData.createPurchaseItem(item)
  }

  public setPaymentData(paymentData: IPaymentData) {
    this._PaymentData = paymentData
  }

  public setConsumerID(value: string) {
    this._ConsumerID = value
  }

  public setRetailer(retailer: IRetailer) {
    this._GReceiptData.setRetailer(retailer)
  }

  public setData(data: IAddReceipt) {
    this._GReceiptData.subtotal = data.subtotal
    this._GReceiptData.tax = data.tax
    this._GReceiptData.discounts = data.discounts
    this._GReceiptData.discountsdenom = data.discountsdenom
    this._GReceiptData.tipamounts = data.tipamounts
    this._GReceiptData.tipamountsdenom = data.tipamountsdenom
    this._GReceiptData.total = data.total
    this._GReceiptData.billing_name = data.billing_name
    this._GReceiptData.shippingAddress = data.shippingAddress
  }

  public getData() {
    return {
      ConsumerID: this._ConsumerID,
      FranchiseID: '0b54dd21-06d4-483b-950c-952c5bcbf5b5',
      GReceiptData: this._GReceiptData,
      PaymentData: this._PaymentData,
      RetailerID: '6da5da9f-b42d-4918-ad43-53b2203df54e',
      GReceiptID: uuidv4(),
      TimeStamp: new Date().toMysqlFormat(),
    }
  }

  toJsonString() {
    return JSON.stringify({
      ConsumerID: this._ConsumerID,
      GReceiptData: this._GReceiptData,
      PaymentData: this._PaymentData,
    })
  }
}

export default Receipt
