"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const saveSubscription = async ({
  paymentId,
  planId,
  userId,
}: {
  paymentId: string;
  planId: number;
  userId: string;
}) => {
  try {
    await prisma.subscriptions.create({
      data: {
        paymentID: paymentId,
        user: {
          connect: {
            id: userId,
          },
        },
        plan: {
          connect: {
            id: planId,
          },
        },
      },
    });

    return {
      message: "Subscription Saved Successfully",
    };
  } catch (e: any) {
    return {
      message: e.message,
    };
  }
};