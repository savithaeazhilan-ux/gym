import dotenv from "dotenv";
dotenv.config();
import { dbOperations } from "./db.ts";
import { MongoClient } from "mongodb";
import { Member, MembershipPlan, ContactInquiry } from "../src/types";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const DB_NAME = "arnold_gym";

let mongoClient: MongoClient | null = null;

// Default initial plans
const DEFAULT_PLANS: MembershipPlan[] = [
  { _id: "101", planName: "Monthly", price: 1500, duration: "1 Month" },
  { _id: "102", planName: "Quarterly", price: 4000, duration: "3 Months" },
  { _id: "103", planName: "Annual", price: 12000, duration: "12 Months" }
];

// Database connector
async function getDb() {
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB Atlas Cloud Database");
  }

  return mongoClient.db(DB_NAME);
}

// Ensure default plans exist
async function seedDefaultPlans() {
  const db = await getDb();

  const plansColl = db.collection<MembershipPlan>("plans");
  const count = await plansColl.countDocuments();

  if (count === 0) {
    await plansColl.insertMany(DEFAULT_PLANS);
    console.log("MongoDB seeded with default plans.");
  }
}

export const dbOperations = {
  // Members
  async getMembers(): Promise<Member[]> {
    const db = await getDb();
    return await db.collection<Member>("members").find({}).toArray();
  },

  async addMember(member: Omit<Member, "_id">): Promise<Member> {
    const newMember: Member = {
      _id: Math.random().toString(36).substring(2, 9),
      ...member,
    };

    const db = await getDb();
    await db.collection<Member>("members").insertOne(newMember);

    return newMember;
  },

  async deleteMember(id: string): Promise<boolean> {
    const db = await getDb();

    const res = await db
      .collection("members")
      .deleteOne({ _id: id as any });

    return (res.deletedCount ?? 0) > 0;
  },

  // Plans
  async getPlans(): Promise<MembershipPlan[]> {
    await seedDefaultPlans();

    const db = await getDb();

    return await db
      .collection<MembershipPlan>("plans")
      .find({})
      .toArray();
  },

  async addPlan(
    plan: Omit<MembershipPlan, "_id">
  ): Promise<MembershipPlan> {
    const newPlan: MembershipPlan = {
      _id: Math.random().toString(36).substring(2, 9),
      ...plan,
    };

    const db = await getDb();

    await db
      .collection<MembershipPlan>("plans")
      .insertOne(newPlan);

    return newPlan;
  },

  async updatePlan(
    id: string,
    updatedPlan: Omit<MembershipPlan, "_id">
  ): Promise<MembershipPlan | null> {
    const db = await getDb();

    await db.collection<MembershipPlan>("plans").updateOne(
      { _id: id as any },
      {
        $set: updatedPlan,
      }
    );

    return {
      _id: id,
      ...updatedPlan,
    };
  },

  async deletePlan(id: string): Promise<boolean> {
    const db = await getDb();

    const res = await db
      .collection("plans")
      .deleteOne({ _id: id as any });

    return (res.deletedCount ?? 0) > 0;
  },

  // Inquiries
  async getInquiries(): Promise<ContactInquiry[]> {
    const db = await getDb();

    return await db
      .collection<ContactInquiry>("inquiries")
      .find({})
      .toArray();
  },

  async addInquiry(
    inquiry: Omit<ContactInquiry, "_id">
  ): Promise<ContactInquiry> {
    const newInquiry: ContactInquiry = {
      _id: Math.random().toString(36).substring(2, 9),
      ...inquiry,
    };

    const db = await getDb();

    await db
      .collection<ContactInquiry>("inquiries")
      .insertOne(newInquiry);

    return newInquiry;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    const db = await getDb();

    const res = await db
      .collection("inquiries")
      .deleteOne({ _id: id as any });

    return (res.deletedCount ?? 0) > 0;
  },
};