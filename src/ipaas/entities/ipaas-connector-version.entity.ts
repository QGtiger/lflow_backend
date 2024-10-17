import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IpaasConnector } from './ipaas-connector.entity';

@Entity({
  name: 'ipaas_connector_version',
})
export class IpaasConnectorVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    comment: '连接器名称',
  })
  name: string;

  @Column({
    length: 255,
    comment: '连接器描述',
  })
  description: string;

  @Column({
    length: 255,
    comment: '连接器帮助文档链接',
    nullable: true,
  })
  documentLink?: string; // 连接器帮组文档链接

  @Column({
    length: 255,
    comment: '连接器logo',
  })
  logo: string; // 连接器logo

  @Column({
    comment: '当前连接器版本',
  })
  version: number; // 当前连接器版本

  @Column({
    comment: '是否发布',
    default: false,
  })
  isPublished: boolean;

  @Column({
    length: 255,
    comment: '发布说明',
    nullable: true,
  })
  pubNote?: string; // 发布说明

  @Column({
    type: 'text',
    comment: '认证协议',
    nullable: true,
  })
  authProtocol?: string; // 认证协议 JSON.stringify(IpaasAuthProtocel)

  @Column({
    type: 'text',
    comment: '动作列表',
    nullable: true,
  })
  actions?: string; // 动作列表 JSON.stringify(IpaasAction[])

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({
    comment: '连接器id',
  })
  connectorId: number;
}
