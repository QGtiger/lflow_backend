export class IpaasConnectorVersion {
  id: number;
  connectorid: number; // 连接器ID 外键
  name: string;
  description: string;
  documentlink?: string; // 连接器帮组文档链接
  logo: string; // 连接器logo
  version: number; // 当前连接器版本
  ispublished: boolean;

  authprotocel: string; // 认证协议 JSON.stringify(IpaasAuthProtocel)
  actions: string; // 动作列表 JSON.stringify(IpaasAction[])

  created_at: Date;
  updated_at: Date;
}

const sql = `
  CREATE TABLE IF NOT EXISTS ipaas_connector_version (
    id SERIAL PRIMARY KEY,
    connectorId INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    documentLink VARCHAR(255),
    logo VARCHAR(255),
    version INTEGER NOT NULL,
    isPublished BOOLEAN DEFAULT FALSE,
    authProtocel TEXT,
    actions TEXT,

    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;
