import type { VercelRequest, VercelResponse } from "@vercel/node";
import { dbOperations } from "./db.ts";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    switch (req.method) {
      case "GET": {
        const plans = await dbOperations.getPlans();
        return res.status(200).json(plans);
      }

      case "POST": {
        const { planName, price, duration } = req.body;

        if (!planName || !price || !duration) {
          return res.status(400).json({
            error: "All plan fields (planName, price, duration) are required",
          });
        }

        const newPlan = await dbOperations.addPlan({
          planName,
          price: Number(price),
          duration,
        });

        return res.status(201).json(newPlan);
      }

      default:
        return res.status(405).json({
          error: "Method not allowed",
        });
    }
  } catch (error: any) {
    console.error("API /plans error:", error);

    return res.status(500).json({
      message: error?.message,
      stack: error?.stack,
    });
  }
}