const tableData = [
    {
        data: {
            pax: 0,
            status: {
                dining: false,
            },
        },
        key: 'A2',
    },
    {
        data: {
            pax: 0,
            status: {
                dining: false,
            },
        },
        key: 'A5',
    },
    {
        data: {
            info: {
                last_order: 'Tue Apr 02 2019 02:14:00 GMT+0000',
                pax: 2,
            },
            orders: [
                {
                    count: 2,
                    id: 'P1',
                    price: 20.4,
                    product_code: 'X01',
                    product_desc: 'description product one',
                    product_name: 'PDONE',
                    product_price: 10.2,
                    toppings: [{
                        topping_code: 'TP01',
                        topping_name: 'Topping One',
                        topping_price: 2,
                    }],
                },
            ],
            pax: 4,
            payment: {
                charges: [{
                    amount: 3,
                    charge: 0.3,
                    mode: '%',
                    name: 'charge_name',
                }],
                sub_total: 1.2,
                taxes: [{
                    amount: 1.2,
                    mode: '$',
                    name: 'tax',
                    tax: 1.2,
                }],
                total: 3.4,
            },
            server: {
                itemId: 2,
                lastOrder: [{
                    count: 2,
                    info: 'Add sugars',
                    productId: 1,
                    topping: [{
                        count: 1,
                        toppingId: 1,
                    }],
                }, {
                    count: 1,
                    info: 'Add money',
                    productId: 2,
                    takeaway: true,
                }],
                orderId: 11,
            },
            status: {
                dining: true,
                pin: '6178',
            },
            products: {
                2: {
                    count: 3,
                    items: [{
                        topping: [1, 2],
                    }, {

                    }, {}],
                },
                3: {
                    count: 1,
                    items: [{
                        topping: [],
                    }],
                },
            },
        },
        key: 'A1',
    },
];

export default tableData;
