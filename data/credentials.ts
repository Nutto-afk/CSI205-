type User = {
  email: string;
  password: string;
  name: string;
  role: string;
  other: string;
};

const users: User[] = [
  {
    email: "user@company.com",
    password: "pass",
    name: "Tanut Phukong",
    role: "USER",
    other: "....",
  },
  {
    email: "admin@company.com",
    password: "pass",
    name: "Pin Chatkaewmanee",
    role: "ADMIN",
    other: "....",
  },
  {
    email: "manager@company.com",
    password: "pass",
    name: "Tanut Phunkong",
    role: "MANAGER",
    other: "....",
  },
];

export type Credentials = {
  token: string;
  email: string;
  name: string;
  role: string;
};

const generateUUID = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return (
    "token-" + Math.random().toString(36).substring(2) + Date.now().toString(36)
  );
};

export const login = (
  email: string,
  password: string,
): Promise<Credentials> => {
  return new Promise<Credentials>((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() <= 0.8) {
          const cleanEmail = email.trim().toLowerCase();
          const user = users.find(
            (u) =>
              (u.email.toLowerCase() === cleanEmail ||
                u.email.toLowerCase().replace("@company.com", "@gmail.com") ===
                  cleanEmail ||
                u.email.toLowerCase().replace("@gmail.com", "@company.com") ===
                  cleanEmail ||
                u.email.split("@")[0].toLowerCase() === cleanEmail) &&
              u.password === password,
          );
          if (user !== undefined) {
            resolve({
              token: generateUUID(),
              email: user.email,
              name: user.name,
              role: user.role,
            });
          } else {
            reject("Invalid email or password");
          }
        } else {
          reject("connection refused");
        }
      },
      1000 + Math.random() * 2000,
    );
  });
};

export const logout = (token: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() <= 0.8) {
          resolve("success");
        } else {
          reject("connection refused");
        }
      },
      1000 + Math.random() * 2000,
    );
  });
};
