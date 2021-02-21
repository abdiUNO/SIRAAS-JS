// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import Request, { Credentials } from "../factories/request";
import LocalStorage from "../factories/local-storage";
import * as types from "../types";
import UI from "./App";
import Receipt from "../Receipt";
// request.authenticate('+18479123404').then(res => {
//   console.log(res)
// })

class Client {
    request: Request;
    private retailer?: types.IRetailer;
    private receipt?: Receipt;
    readonly storage: types.StorageFactory;
    private credentials: Credentials;
    constructor(options: types.InitOptions) {
        this.storage = new LocalStorage();
        this.credentials = new Credentials("", "", "", "", "", false);
        this.retailer = options.retailer;
        this.request = new Request({
            ...options,
            headers: {},
            storage: this.storage
        });
    }

    Authenticate(opts: any) {
        const { onError, onSubmit, onSuccess } = opts;

        return async (phoneNumber: any) => {
            onSubmit(phoneNumber);

            try {
                this.credentials = await this.request.authenticateV2(phoneNumber.value);
                onSuccess(this.credentials);
            } catch (e) {
                onError(e);
            }
        };
    }

    AddReceipt(data: types.IAddReceipt) {
        const { paymentData, items } = data;

        this.receipt = new Receipt();

        if (this.retailer) this.receipt.setRetailer(this.retailer);

        this.receipt.setConsumerID(this.credentials?.consumerId);
        this.receipt.setPaymentData(paymentData);

        items.map((item) => {
            if (this.receipt) this.receipt.addPurchaseItem(item);
        });

        this.receipt.setData(data);

        const body = {
            RetailersReceiptData: this.receipt.getData()
        };

        console.log(body);
        this.request.post(
            "https://tadghrq5b0.execute-api.us-east-2.amazonaws.com/sendReceipt",
            body,
            {},
            this.credentials.phoneNumber.toString(),
            true
        );
    }
}

const GReceipt = {
    Client,
    UI
};

export default GReceipt;
