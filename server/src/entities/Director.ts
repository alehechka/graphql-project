import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';

@ObjectType()
@Entity()
export class Director extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column()
	firstName: string;

	@Field()
	@Column()
	lastName: string;

	@Field(() => Int)
	@Column('int')
    age: number;
    
    @Field(() => [Movie], {nullable: true})
    @OneToMany(() => Movie, movie => movie.director) 
    movies: Movie[];
}
