import { Role } from './Role';
import { ApiMeta } from 'src/api/entities/ApiMeta';
export declare class User {
    id: number;
    username: string;
    password: string;
    email: string;
    isAdmin: boolean;
    createTime: Date;
    updateTime: Date;
    roles: Role[];
    apiMetas: ApiMeta[];
}
