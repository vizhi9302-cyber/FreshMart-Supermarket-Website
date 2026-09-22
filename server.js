const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = 3000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));


// =====================================
// IMAGE FOLDER
// =====================================

app.use(
    "/img",
    express.static(
        path.join(__dirname, "../FreshMart/img")
    )
);


// =====================================
// MYSQL CONNECTION
// =====================================

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "freshmart_db"

});


// =====================================
// CONNECT MYSQL
// =====================================

db.connect((err) => {

    if (err) {

        console.log(
            "MySQL connection error:",
            err.message
        );

        return;

    }

    console.log(
        "MySQL connected successfully!"
    );

});


// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {

    res.send(
        "FreshMart Backend is Running!"
    );

});


// =====================================
// GET PRODUCTS
// =====================================

app.get("/api/products", (req, res) => {

    const sql = `

        SELECT *

        FROM products

        ORDER BY id DESC

    `;


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.log(
                    "Products fetch error:",
                    err
                );

                return res.status(500).json({

                    error:
                        err.message

                });

            }


            res.json(results);

        }
    );

});


// =====================================
// ADD NEW PRODUCT
// =====================================

app.post("/api/products", (req, res) => {

    console.log(
        "PRODUCT REQUEST RECEIVED:",
        req.body
    );


    const {

        name,

        price,

        category,

        image

    } = req.body;


    // CHECK DETAILS

    if (
        !name ||
        !price ||
        !category ||
        !image
    ) {

        return res.status(400).json({

            error:
                "All product details are required"

        });

    }


    const sql = `

        INSERT INTO products

        (
            name,
            price,
            category,
            image
        )

        VALUES (?, ?, ?, ?)

    `;


    db.query(

        sql,

        [
            name,
            price,
            category,
            image
        ],

        (err, result) => {


            if (err) {

                console.log(
                    "Product add error:",
                    err
                );


                return res.status(500).json({

                    error:
                        err.message

                });

            }


            console.log(
                "Product added:",
                result.insertId
            );


            res.json({

                message:
                    "Product added successfully!",

                productId:
                    result.insertId

            });

        }

    );

});


// =====================================
// ADD ORDER
// =====================================

app.post("/api/orders", (req, res) => {

    console.log(
        "ORDER REQUEST RECEIVED:",
        req.body
    );


    const {

        customer_name,

        phone,

        address,

        payment_method,

        total_amount,

        products

    } = req.body;


    const sql = `

        INSERT INTO orders

        (
            customer_name,
            phone,
            address,
            payment_method,
            total_amount
        )

        VALUES (?, ?, ?, ?, ?)

    `;


    db.query(

        sql,

        [

            customer_name,

            phone,

            address,

            payment_method,

            total_amount

        ],

        (err, result) => {


            if (err) {

                console.log(
                    "Order save error:",
                    err
                );


                return res.status(500).json({

                    error:
                        err.message

                });

            }


            const orderId =
                result.insertId;


            // NO PRODUCTS

            if (
                !products ||
                products.length === 0
            ) {

                return res.json({

                    message:
                        "Order placed successfully!",

                    orderId:
                        orderId

                });

            }


            // ORDER ITEMS

            const itemSql = `

                INSERT INTO order_items

                (
                    order_id,
                    product_name,
                    price,
                    quantity,
                    subtotal
                )

                VALUES ?

            `;


            const itemValues =
                products.map(product => {


                    const price =
                        parseFloat(
                            product.price
                        ) || 0;


                    const quantity =
                        parseInt(
                            product.quantity
                        ) || 1;


                    const subtotal =
                        price * quantity;


                    return [

                        orderId,

                        product.name,

                        price,

                        quantity,

                        subtotal

                    ];

                });


            db.query(

                itemSql,

                [itemValues],

                (itemErr) => {


                    if (itemErr) {

                        console.log(
                            "Order items save error:",
                            itemErr
                        );


                        return res.status(500).json({

                            error:
                                itemErr.message

                        });

                    }


                    res.json({

                        message:
                            "Order placed successfully!",

                        orderId:
                            orderId

                    });

                }

            );

        }

    );

});


// =====================================
// GET ALL ORDERS
// =====================================

app.get("/api/orders", (req, res) => {


    const orderSql = `

        SELECT *

        FROM orders

        ORDER BY id DESC

    `;


    db.query(

        orderSql,

        (err, orders) => {


            if (err) {

                console.log(
                    "Orders fetch error:",
                    err
                );


                return res.status(500).json({

                    error:
                        err.message

                });

            }


            if (
                orders.length === 0
            ) {

                return res.json([]);

            }


            const orderIds =
                orders.map(
                    order =>
                        order.id
                );


            const itemSql = `

                SELECT *

                FROM order_items

                WHERE order_id IN (?)

            `;


            db.query(

                itemSql,

                [orderIds],

                (itemErr, items) => {


                    if (itemErr) {

                        console.log(
                            "Order items fetch error:",
                            itemErr
                        );


                        return res.status(500).json({

                            error:
                                itemErr.message

                        });

                    }


                    const finalOrders =
                        orders.map(
                            order => {

                                return {

                                    ...order,

                                    items:
                                        items.filter(
                                            item =>
                                                item.order_id ===
                                                order.id
                                        )

                                };

                            }
                        );


                    res.json(
                        finalOrders
                    );

                }

            );

        }

    );

});


// =====================================
// UPDATE ORDER STATUS
// =====================================

app.put(
    "/api/orders/:id/status",
    (req, res) => {


        const orderId =
            req.params.id;


        const {
            status
        } = req.body;


        const sql = `

            UPDATE orders

            SET status = ?

            WHERE id = ?

        `;


        db.query(

            sql,

            [
                status,
                orderId
            ],

            (err, result) => {


                if (err) {

                    console.log(
                        "Status update error:",
                        err
                    );


                    return res.status(500).json({

                        error:
                            err.message

                    });

                }


                res.json({

                    message:
                        "Order status updated successfully!"

                });

            }

        );

    }

);


// =====================================
// START SERVER
// =====================================

app.listen(

    PORT,

    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }

);
