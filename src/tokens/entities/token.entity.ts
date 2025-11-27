import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{unique: true})
    token: string;

    @Column('int', { default: 10 })
    reqLeft: number;

    @Column('bool',{default: true})
    active: boolean;

}
