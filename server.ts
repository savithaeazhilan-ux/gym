import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { dbOperations } from "./lib/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
  // --- API Routes ---

  // Membership Plans
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await dbOperations.getPlans();
      res.json(plans);
    } catch (error) {
      console.error("GET /api/plans error:", error);
      res.status(500).json({ error: "Failed to fetch membership plans" });
    }
  });

  app.post("/api/plans", async (req, res) => {
    try {
      const { planName, price, duration } = req.body;
      if (!planName || !price || !duration) {
        return res.status(400).json({ error: "All plan fields (planName, price, duration) are required" });
      }
      const newPlan = await dbOperations.addPlan({ planName, price: Number(price), duration });
      res.status(201).json(newPlan);
    } catch (error) {
      console.error("POST /api/plans error:", error);
      res.status(500).json({ error: "Failed to create membership plan" });
    }
  });

  app.put("/api/plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { planName, price, duration } = req.body;
      if (!planName || !price || !duration) {
        return res.status(400).json({ error: "All plan fields (planName, price, duration) are required" });
      }
      const updatedPlan = await dbOperations.updatePlan(id, { planName, price: Number(price), duration });
      if (!updatedPlan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(updatedPlan);
    } catch (error) {
      console.error("PUT /api/plans error:", error);
      res.status(500).json({ error: "Failed to update membership plan" });
    }
  });

  app.delete("/api/plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await dbOperations.deletePlan(id);
      if (!success) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json({ message: "Plan deleted successfully" });
    } catch (error) {
      console.error("DELETE /api/plans error:", error);
      res.status(500).json({ error: "Failed to delete membership plan" });
    }
  });

  // Members
  app.get("/api/members", async (req, res) => {
    try {
      const members = await dbOperations.getMembers();
      res.json(members);
    } catch (error) {
      console.error("GET /api/members error:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const { name, email, phone, membership } = req.body;
      if (!name || !email || !phone || !membership) {
        return res.status(400).json({ error: "All registration fields (name, email, phone, membership) are required" });
      }
      const joinDate = new Date().toISOString().split("T")[0];
      const newMember = await dbOperations.addMember({ name, email, phone, membership, joinDate });
      res.status(201).json(newMember);
    } catch (error) {
      console.error("POST /api/members error:", error);
      res.status(500).json({ error: "Failed to register member" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await dbOperations.deleteMember(id);
      if (!success) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json({ message: "Member record deleted successfully" });
    } catch (error) {
      console.error("DELETE /api/members error:", error);
      res.status(500).json({ error: "Failed to delete member" });
    }
  });

  // Inquiries
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await dbOperations.getInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("GET /api/inquiries error:", error);
      res.status(500).json({ error: "Failed to fetch contact inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All inquiry fields (name, email, subject, message) are required" });
      }
      const date = new Date().toISOString().split("T")[0];
      const newInquiry = await dbOperations.addInquiry({ name, email, subject, message, date });
      res.status(201).json(newInquiry);
    } catch (error) {
      console.error("POST /api/inquiries error:", error);
      res.status(500).json({ error: "Failed to submit inquiry" });
    }
  });

  app.delete("/api/inquiries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await dbOperations.deleteInquiry(id);
      if (!success) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json({ message: "Inquiry deleted successfully" });
    } catch (error) {
      console.error("DELETE /api/inquiries error:", error);
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  });

  // --- Vite Asset Middleware OR Static Route Handling ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Arnold Gym backend server is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
