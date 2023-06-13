'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order');
// module.exports = createCoreController("api::order.order", ({ strapi }) => ({
//   async create(ctx) {
//     const products = ctx.request.body.data;
//     try {
//       // retrieve item information
//       const lineItems = await Promise.all(
//         products.map(async (product) => {
//           const item = await strapi
//             .service("api::item.item")
//             .findOne(product.id);

//           return {
//             price_data: {
//               currency: "eur",
//               product_data: {
//                 name: item.name,
//               },
//               unit_amount: item.price,
//             },
//             quantity: product.count,
//           };
//         })
//       );

//       // create the item
//       await strapi
//         .service("api::order.order")
//         .create({ data: { products } });

//       // return the session id
//       return { data: data };
//     } catch (error) {
//       ctx.response.status = 500;
//       return error.response
//       //return { error: { message: "There was a problem saving the order" } };
//     }
//   },
// }));
