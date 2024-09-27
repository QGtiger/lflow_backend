import { Inject, Injectable } from '@nestjs/common';
import type { Client } from 'pg';

@Injectable()
export class PostgresService {
  @Inject('POSTGRES_CLIENT')
  private postgresClient: Client;

  /**
   * 新增记录
   * @param table 插入表名
   * @param values 插入数据
   * @returns
   */
  async create<T = any>(table: string, values: T) {
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.keys(values)
      .map((_, index) => `$${index + 1}`)
      .join(', ');
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const queryResult = await this.query(query, Object.values(values));
    return queryResult.rows[0];
  }

  async query(query: string, values: any[] = []): Promise<any> {
    return this.postgresClient.query(query, values);
  }

  async delete(table: string, where: any) {
    const wherePlaceholders = Object.keys(where).reduce((acc, key, index) => {
      return `${acc}${index === 0 ? '' : ' AND '}${key} = $${index + 1}`;
    }, '');
    const query = `DELETE FROM ${table} WHERE ${wherePlaceholders}`;
    return this.query(query, Object.values(where));
  }

  async findOne<T>(table: string, where: Partial<T>): Promise<T> {
    const wherePlaceholders = Object.keys(where).reduce((acc, key, index) => {
      return `${acc}${index === 0 ? '' : ' AND '}${key} = $${index + 1}`;
    }, '');
    const query = `SELECT * FROM ${table} WHERE ${wherePlaceholders}`;
    const { rows } = await this.query(query, Object.values(where));
    return rows[0];
  }

  async findAll<T = any>(table: string, where: any): Promise<T> {
    const wherePlaceholders = Object.keys(where).reduce((acc, key, index) => {
      return `${acc}${index === 0 ? '' : ' AND '}${key} = $${index + 1}`;
    }, '');
    const query = `SELECT * FROM ${table} WHERE ${wherePlaceholders}`;
    const { rows } = await this.query(query, Object.values(where));
    return rows;
  }

  async update(table: string, where: any, values: any) {
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.keys(values)
      .map((_, index) => `$${index + 1}`)
      .join(', ');

    const wherePlaceholders = Object.keys(where).reduce((acc, key, index) => {
      return `${acc}${index === 0 ? '' : ' AND '}${key} = $${
        index + 1 + Object.keys(values).length
      }`;
    }, '');
    const query = `UPDATE ${table} SET (${columns}) = (${placeholders}) WHERE ${wherePlaceholders}`;
    return this.query(query, [
      ...Object.values(values),
      ...Object.values(where),
    ]);
  }

  async findAllByLeftJoin(
    table: string,
    joinTable: string,
    on: string,
    where: any,
  ) {
    const columns = Object.keys(where).join(' AND ');
    const placeholders = Object.keys(where)
      .map((_, index) => `$${index + 1}`)
      .join(' AND ');
    const query = `SELECT * FROM ${table} LEFT JOIN ${joinTable} ON ${on} WHERE ${columns} = ${placeholders}`;
    const { rows } = await this.query(query, Object.values(where));
    return rows;
  }
}
