export class IpaasConnector {
  id: number;
  code: string; // 连接器代码
  version: number; // 连接器版本

  created_at: Date;
  updated_at: Date;

  user_id: number;
}

const sql = `
  CREATE TABLE IF NOT EXISTS ipaas_connector (
    id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    version INTEGER NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;
