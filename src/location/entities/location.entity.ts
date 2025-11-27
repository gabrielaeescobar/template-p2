import { Character } from "src/characters/entities/character.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, ManyToMany, JoinColumn } from "typeorm";

@Entity()
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    type: string;

    @Column('int')
    cost: number;

    @OneToOne(() => Character, character => character.location)
    @JoinColumn()
    owner: Character;

    @ManyToMany(() => Character, character => character.favorites)
    characters: Character[];
}
