export declare class PostgresService {
    private postgresClient;
    create(table: string, values: any): Promise<any>;
    query(query: string, values?: any[]): Promise<any>;
    findOne(table: string, where: any): Promise<any>;
}
