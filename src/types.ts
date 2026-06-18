export interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  membership: string;
  joinDate: string;
}

export interface MembershipPlan {
  _id: string;
  planName: string;
  price: number;
  duration: string;
}

export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}
