import { MenuImages } from "./menu";
import { ownPlateConfig } from "@/config/project";
import { stripeRegion } from "@/utils/utils";

export interface OrderMenuItemData {
  category1: string;
  category2: string;
  itemName: string;
  price: number;
  images: MenuImages;
  itemPhoto: string;
}
export interface OrderInfoData {
  name: string;
  number: string;
  totalCharge: number;
  total: number;
  tax: number;
  // options: {[key: string]: [[key: string]: string]}
  timeEstimated: any; // TODO firestore timestamp
  timeConfirmed: any;
  timePlaced: any;
  accounting?: {
    food: {
      revenue: number;
      tax: number;
    };
    alcohol: {
      revenue: number;
      tax: number;
    };
    service?: {
      revenue: number;
      tax: number;
    };
  };
  tip: number;
  menuItems: { [key: string]: OrderMenuItemData };
  order: { [key: string]: [number] };
  options: { [key: string]: [string] };
}

export interface OrderItem {}

export class OrderInfo {}

export const order2ReportData = (
  order: OrderInfoData,
  serviceTaxRate: number
) => {
  const multiple = stripeRegion.multiple;
  order.timeConfirmed = order?.timeConfirmed?.toDate();
  order.timePlaced = order?.timePlaced?.toDate();
  order.timeEstimated = order?.timeEstimated?.toDate();
  if (!order.accounting) {
    order.accounting = {
      food: {
        revenue: order.total - order.tax,
        tax: order.tax,
      },
      alcohol: {
        revenue: 0,
        tax: 0,
      },
    };
  }
  if (ownPlateConfig.region === "JP") {
    const serviceTax =
      Math.round(order.tip * (1 - 1 / (1 + serviceTaxRate)) * multiple) /
      multiple;
    order.accounting.service = {
      revenue: order.tip - serviceTax,
      tax: serviceTax,
    };
  } else {
    order.accounting.service = {
      revenue: order.tip,
      tax: 0,
    };
  }
  return order;
};
