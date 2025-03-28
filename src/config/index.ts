interface Config {
  apiUrl: string;
  googleClientId: string;
  googleClientSecret: string;
}

export const config: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000" || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
};
