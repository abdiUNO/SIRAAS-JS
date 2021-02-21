// @ts-ignore
import { useState } from "preact/hooks";

import GReceipt from "./components/index.tsx";
import Button from "./components/Button";
import Box from "./components/primitives/Box";
import { h } from "preact";
const client = new GReceipt.Client({
    clientKey: "SpitfireMerch",
    clientSecret: "hU4Js2Uzn2QZh&THx5Ye^Ypfz7UP%8M!",
    retailer: {
        RetailerID: "6da5da9f-b42d-4918-ad43-53b2203df54e",
        RetailerName: "KlubKangaroo",
        InterfaceName: "KlubKangarooPrinter1",
        RetailerType: "Online",
        RetailerLogo: null,
        RetailerAddress: "879 March St",
        RetailerZipCode: "60047"
    }
});

const CART_ITEMS = [
    {
        item_id: "V1StGXR8_Z5jdHi6B",
        itemname: "Carmel Brown Sofa",
        UPC: null,
        internal_id: "V1StGXR8_Z5jdHi6B",
        itemPrice: 1000,
        qty: 2,
        color: null,
        size: null,
        weight: null,
        description:
            "Stay a while. The Timber charme chocolat sofa is set atop an oak trim and flaunts fluffy leather back and seat cushions. Over time, this brown leather sofa’s full-aniline upholstery will develop a worn-in vintage look. Snuggle up with your cutie (animal or human) and dive into a bowl of popcorn. This sofa is really hard to leave. Natural color variations, wrinkles and creases are part of the unique characteristics of this leather. It will develop a relaxed vintage look with regular use.",
        terms: null,
        tax: 7,
        discount: null,
        subtotal: null,
        Total: 1000,
        taxDenominator: "%",
        dept_type: "sofas"
    }
];

function App() {
    const [authenticated, setAuth] = useState(false);

    const billing_info = {
        name: "John Doe",
        email: "",
        street: "6265 Brockport Spencerport Rd",
        city: "Brockport",
        postal_code: "14420",
        state: "NY"
    };

    const { name, street, city, postal_code, state } = billing_info;
    return (
        <div>
            <GReceipt.UI client={client} authenticated={authenticated} />

            <Box width={0.5}>
                <Button
                    onClick={() =>
                        client.AddReceipt({
                            items: CART_ITEMS,
                            subtotal: 1000,
                            tax: 5.4,
                            discounts: 0,
                            discountsdenom: "%",
                            tipamounts: 0,
                            tipamountsdenom: "%",
                            total: 1000 * 0.054,
                            billing_name: name,
                            shippingAddress: `${street}, ${city}, ${state}, ${postal_code}`
                        })
                    }
                >
                    Check Out
                </Button>
            </Box>
        </div>
    );
}

export default App;
