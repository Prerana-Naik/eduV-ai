export interface UserProfile {
  id?: string;
  name: string;
  role: "student" | "teacher";
  age: number | string;
  subject: string;
  chatStyle: string;
  qualification: string;
  email?: string;
  avatar_url?: string;
}