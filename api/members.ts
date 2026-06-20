import type { VercelRequest, VercelResponse } from "@vercel/node";
import { dbOperations } from "./db.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    switch (req.method) {

      case "GET": {
        const members = await dbOperations.getMembers();
        return res.status(200).json(members);
      }

      case "POST": {
        const { name, email, phone, membership } = req.body;

        if (!name || !email || !phone || !membership) {
          return res.status(400).json({
            error: "All fields are required",
          });
        }

        const newMember = await dbOperations.addMember({
          name,
          email,
          phone,
          membership,
        });

        return res.status(201).json(newMember);
      }

      default:
        return res.status(405).json({
          error: "Method not allowed",
        });
    }

  } catch (error: any) {
    console.error("API /members error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}