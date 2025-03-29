interface Config {
  apiUrl: string;
  googleClientId: string;
  googleClientSecret: string;
}

export const config: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
};
