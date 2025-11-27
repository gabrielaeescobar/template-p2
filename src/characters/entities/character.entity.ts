import { Column, Entity, OneToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Location } from "src/location/entities/location.entity";


@Entity()
export class Character {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('int')
    salary:number;

    @Column('boolean')
    employee: boolean;

    @OneToOne(()=> Location, location => location.owner)
    location: Location;

    @ManyToMany(() => Location, location => location.characters)
    @JoinTable({ name: 'character_favorites' })
    favorites: Location[];
}
