- [使用 ValidationPipe 进行参数校验](https://juejin.cn/book/7226988578700525605/section/7237073778033819708)
- [@vercel/kv](https://github.com/vercel/storage/blob/main/packages/kv/README.md) redis 数据库连接器方式
- [@vercel/postgress](https://github.com/vercel/storage/blob/main/packages/postgres/README.md)
- [jwt session](https://juejin.cn/book/7226988578700525605/section/7229127824358637605)

创建 cloud_functions. sql 语句

```sql
create table if not exists cloud_functions (
  id serial primary key,
  name varchar(255) not null,
  description varchar(255) not null,
  isdir boolean default true,
  created_at timestamp with time zone default current_timestamp, --默认当前时间
  updated_at timestamp with time zone default current_timestamp,
  uid varchar(255) unique not null, -- uuid 标识
)
```

额外需要 user_id 外键 关联用户表  
parent_uid 外键， 关联自身表
注意要配置约束 CASCADE。 关联表数据被删除则自身记录也要被删除
sql 范例

```sql
ALTER TABLE "public"."cloud_functions"
  ADD COLUMN "user_id" int4 NOT NULL,
  ADD COLUMN "parent_uid" varchar(255),
  ADD CONSTRAINT "cloud_functions_users_id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "cloud_functions_parent_uid" FOREIGN KEY ("parent_uid") REFERENCES "public"."cloud_functions" ("uid") ON DELETE CASCADE ON UPDATE CASCADE;
```

如果您已经有一个存在的表，并且想要将其中的 uid 字段修改为唯一（unique），您可以使用 ALTER TABLE 语句来添加唯一性约束。以下是具体的 SQL 命令：

```sql
ALTER TABLE your_table_name ADD CONSTRAINT constraint_name UNIQUE (uid);
```

在这里，your_table_name 是您的表名，而 constraint_name 是您为这个唯一性约束指定的名称。如果您不指定 constraint_name，PostgreSQL 将会自动生成一个。

updated_at 新建触发函数和触发器。

在 PostgreSQL 中，要实现 `updated_at` 字段在每次记录变更时自动更新，您可以使用触发器（trigger）和触发器函数（trigger function）。以下是创建这样一个触发器和触发器函数的步骤：

1. **创建触发器函数**：这个函数将在每次更新操作发生时被调用，用于更新 `updated_at` 字段。

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

2. **创建触发器**：这个触发器将在每次更新操作发生时调用上面创建的触发器函数。

```sql
CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON cloud_functions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

3. **创建表**：现在您可以创建表，并包含 `updated_at` 字段，它将由触发器自动更新。

```sql
CREATE TABLE IF NOT EXISTS cloud_functions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  isdir BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  uid VARCHAR(255) UNIQUE NOT NULL,
  -- 触发器已经定义，会在更新记录时自动设置 updated_at
);
```

在这个例子中，`update_updated_at_column` 函数会在每次 `cloud_functions` 表中的记录被更新时被触发，并将 `updated_at` 字段设置为当前时间戳。`trigger_update_updated_at` 触发器确保在每次更新操作之前调用这个函数。

现在，每当您更新 `cloud_functions` 表中的记录时，`updated_at` 字段会自动更新为当前时间。例如：

```sql
UPDATE cloud_functions
SET name = 'New Function Name'
WHERE id = 1;
```

执行这个 `UPDATE` 语句后，表中 `id` 为 1 的记录的 `updated_at` 字段会自动设置为当前时间。

## 发布一下
