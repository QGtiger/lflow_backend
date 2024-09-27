interface JwtUserData {
  id: number;

  username: string;

  email: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
    headers: {
      authorization: `Bearer ${string}`;
    };
    ip: string;
    method: string;
    path: string;
    body: any;
  }
}

type ExcludeEntity<T> = Omit<T, 'created_at' | 'updated_at' | 'id'>;
