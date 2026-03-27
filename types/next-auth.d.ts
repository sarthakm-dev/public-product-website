import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      strapiToken?: string;
    };
  }

  interface User {
    strapiToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    strapiToken?: string;
  }
}
