import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { Member, MembershipPlan, ContactInquiry } from '../src/types';

const MONGODB_URI = process.env.MONGODB_URI;

const DB_NAME = "arnold_gym";

let mongoClient: MongoClient | null = null;
let isConnected = false;

// Create data directory for JSON files fallback
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Default initial plans
const DEFAULT_PLANS: MembershipPlan[] = [
  { _id: "101", planName: "Monthly", price: 1500, duration: "1 Month" },
  { _id: "102", planName: "Quarterly", price: 4000, duration: "3 Months" },
  { _id: "103", planName: "Annual", price: 12000, duration: "12 Months" }
];

// Helper to write JSON files
const writeJson = (file: string, data: any) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
};

// Helper to read JSON files
const readJson = (file: string, defaultValue: any) => {
  if (!fs.existsSync(file)) {
    writeJson(file, defaultValue);
    return defaultValue;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (error) {
    console.error(`Error reading data file ${file}, fallback to defaults`, error);
    return defaultValue;
  }
};

// Lazy Database connector
async function getDb() {
  console.log("getDb called");
  console.log("MONGODB_URI:", !!MONGODB_URI);

  if (!MONGODB_URI) return null;

  try {
    if (!mongoClient) {
      console.log("Attempting MongoDB connection");

      mongoClient = new MongoClient(MONGODB_URI);
      await mongoClient.connect();

      console.log("Successfully connected to MongoDB Atlas Cloud Database");
      isConnected = true;
    }

    return mongoClient.db(DB_NAME);
  } catch (err) {
    console.error("MongoDB error:", err);
    return null;
  }
}

// Ensure plans are seeded
async function seedDefaultPlans() {
  const db = await getDb();
  if (db) {
    const plansColl = db.collection<MembershipPlan>('plans');
    const count = await plansColl.countDocuments();
    if (count === 0) {
      await plansColl.insertMany(DEFAULT_PLANS);
      console.log("MongoDB seeded with default plans.");
    }
  } else {
    // Check local JSON files
    const plans = readJson(PLANS_FILE, null);
    if (!plans || plans.length === 0) {
      writeJson(PLANS_FILE, DEFAULT_PLANS);
      console.log("Local backup plans seeded.");
    }
  }
}

// Initialize seed
seedDefaultPlans().catch(err => console.error("Error seeding plans", err));

// Database Export Interfaces
export const dbOperations = {
  // --- Members Collection ---
  async getMembers(): Promise<Member[]> {
    const db = await getDb();
    if (db) {
      const items = await db.collection<Member>('members').find({}).toArray();
      return items;
    } else {
      return readJson(MEMBERS_FILE, []);
    }
  },

  async addMember(member: Omit<Member, '_id'>): Promise<Member> {
    const newId = Math.random().toString(36).substr(2, 9);
    const newMember: Member = {
      _id: newId,
      ...member
    };

    const db = await getDb();
    if (db) {
      await db.collection<Member>('members').insertOne(newMember);
    } else {
      const members = readJson(MEMBERS_FILE, []);
      members.push(newMember);
      writeJson(MEMBERS_FILE, members);
    }
    return newMember;
  },

  async deleteMember(id: string): Promise<boolean> {
    const db = await getDb();
    if (db) {
      const res = await db.collection('members').deleteOne({ _id: id as any });
      return (res.deletedCount ?? 0) > 0;
    } else {
      const members = readJson(MEMBERS_FILE, []) as Member[];
      const filtered = members.filter(m => m._id !== id);
      writeJson(MEMBERS_FILE, filtered);
      return members.length !== filtered.length;
    }
  },

  // --- Membership Plans Collection ---
  async getPlans(): Promise<MembershipPlan[]> {
    const db = await getDb();
    if (db) {
      const items = await db.collection<MembershipPlan>('plans').find({}).toArray();
      return items;
    } else {
      return readJson(PLANS_FILE, DEFAULT_PLANS);
    }
  },

  async addPlan(plan: Omit<MembershipPlan, '_id'>): Promise<MembershipPlan> {
    const newId = Math.random().toString(36).substr(2, 9);
    const newPlan: MembershipPlan = {
      _id: newId,
      ...plan
    };

    const db = await getDb();
    if (db) {
      await db.collection<MembershipPlan>('plans').insertOne(newPlan);
    } else {
      const plans = readJson(PLANS_FILE, DEFAULT_PLANS) as MembershipPlan[];
      plans.push(newPlan);
      writeJson(PLANS_FILE, plans);
    }
    return newPlan;
  },

  async updatePlan(id: string, updatedPlan: Omit<MembershipPlan, '_id'>): Promise<MembershipPlan | null> {
    const db = await getDb();
    if (db) {
      const res = await db.collection<MembershipPlan>('plans').findOneAndUpdate(
        { _id: id as any },
        { $set: updatedPlan },
        { returnDocument: 'after' }
      );
      return res;
    } else {
      const plans = readJson(PLANS_FILE, DEFAULT_PLANS) as MembershipPlan[];
      const idx = plans.findIndex(p => p._id === id);
      if (idx !== -1) {
        plans[idx] = { _id: id, ...updatedPlan };
        writeJson(PLANS_FILE, plans);
        return plans[idx];
      }
      return null;
    }
  },

  async deletePlan(id: string): Promise<boolean> {
    const db = await getDb();
    if (db) {
      const res = await db.collection('plans').deleteOne({ _id: id as any });
      return (res.deletedCount ?? 0) > 0;
    } else {
      const plans = readJson(PLANS_FILE, DEFAULT_PLANS) as MembershipPlan[];
      const filtered = plans.filter(p => p._id !== id);
      writeJson(PLANS_FILE, filtered);
      return plans.length !== filtered.length;
    }
  },

  // --- Inquiries Collection ---
  async getInquiries(): Promise<ContactInquiry[]> {
    const db = await getDb();
    if (db) {
      const items = await db.collection<ContactInquiry>('inquiries').find({}).toArray();
      return items;
    } else {
      return readJson(INQUIRIES_FILE, []);
    }
  },

  async addInquiry(inquiry: Omit<ContactInquiry, '_id'>): Promise<ContactInquiry> {
    const newId = Math.random().toString(36).substr(2, 9);
    const newInquiry: ContactInquiry = {
      _id: newId,
      ...inquiry
    };

    const db = await getDb();
    if (db) {
      await db.collection<ContactInquiry>('inquiries').insertOne(newInquiry);
    } else {
      const inquiries = readJson(INQUIRIES_FILE, []);
      inquiries.push(newInquiry);
      writeJson(INQUIRIES_FILE, inquiries);
    }
    return newInquiry;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    const db = await getDb();
    if (db) {
      const res = await db.collection('inquiries').deleteOne({ _id: id as any });
      return (res.deletedCount ?? 0) > 0;
    } else {
      const inquiries = readJson(INQUIRIES_FILE, []) as ContactInquiry[];
      const filtered = inquiries.filter(i => i._id !== id);
      writeJson(INQUIRIES_FILE, filtered);
      return inquiries.length !== filtered.length;
    }
  }
};
