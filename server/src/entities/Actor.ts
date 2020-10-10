import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';
// import { Movie } from './Movie';

@ObjectType()
@Entity()
export class Actor extends BaseEntity {
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

	@Field(() => [Movie])
	@ManyToMany(() => Movie, async (movie) => await movie.actors, { lazy: true })
	@JoinTable({
		name: 'movie_actors', // table name for the junction table of this relation
		joinColumn: {
			name: 'actorId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'movieId',
			referencedColumnName: 'id',
		},
	})
	movies: Promise<Movie[]>;
}
