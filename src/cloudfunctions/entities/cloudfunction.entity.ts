import { User } from 'src/user/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'cloudfunction',
})
export class Cloudfunction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    comment: '函数名称',
  })
  name: string;

  @Column({
    length: 100,
    comment: '函数描述',
  })
  description: string;

  @Column({
    length: 255,
    comment: '函数 uid',
  })
  uid: string;

  @Column({
    length: 255,
    comment: '父及目录id',
    default: 'root',
  })
  parentUid: string;

  @Column({
    comment: '是否是目录',
    default: true,
  })
  isDir: boolean;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userId: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
