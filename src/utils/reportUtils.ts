const reportHeadersTop = ["name", "restaurantName", "statusName", "userName"];
const reportHeadersTime = [
  "datePlaced",
  "dateAccepted",
  "dateConfirmed",
  "dateCompleted",
  "timeRequested",
  "timeToPickup",
];

const reportHeadersItem = ["itemName", "options", "category1", "category2"];

export const reportHeaders = [
  ...reportHeadersTop,
  "phoneNumber",
  ...reportHeadersTime,

  ...reportHeadersItem,
  "count",
  "total",
  "payment",
  "memo",
];
export const reportHeadersForMo = [
  ...reportHeadersTop,
  "phoneNumber",
  ...reportHeadersTime,

  "itemName",
  // ...reportHeadersItem,

  "productId",
  "category",
  "categoryId",
  "subCategory",
  "subCategoryId",

  // for mo
  "menuPrice",
  "taxRate",
  "tax",
  // end for mo

  "count",

  "productSubTotal",
  "total",
  "payment",
  "memo",
];
export const reportHeadersWithAddress = [
  ...reportHeadersTop,

  "ec.name",
  "ec.zip",
  "ec.prefecture",
  "ec.address",
  "ec.email",

  "phoneNumber",

  ...reportHeadersTime,

  ...reportHeadersItem,
  "count",
  "total",
  "shippingCost",
  "payment",
  "isDelivery",
  "memo",
];

/* ---- */

export const revenueHeader = [
  "date",
  "restaurantName",
  "orderStatus",
  "foodRevenue",
  "foodTax",
  "alcoholRevenue",
  "salesTax",
  "tipShort",
  "serviceTax",
  "total",
  "name",
  "payment",
];
