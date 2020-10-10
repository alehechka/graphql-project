import { Field, Int, ObjectType } from 'type-graphql';
import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Actor } from './Actor';
import { Director } from './Director';

@ObjectType()
@Entity()
export class Movie extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column()
	title: string;

	@Field(() => String, { nullable: true })
	@Column('text', { nullable: true })
	subtitle?: string;

	@Field(() => Int)
	@Column('int', { default: 60 })
	minutes: number;

	@Field(() => Int, { nullable: true })
	@Column('int', { nullable: true })
	rating?: number;

	@Field()
	@ManyToOne(() => Director, (director) => director.movies)
	director: Director;

	@Field()
	@Column()
	directorId: string;

	@Field(() => [Actor])
	@ManyToMany(() => Actor, async (actor) => await actor.movies, { lazy: true })
	@JoinTable({
		name: 'movie_actors', // table name for the junction table of this relation
		joinColumn: {
			name: 'movieId',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'actorId',
			referencedColumnName: 'id',
		},
	})
	actors: Promise<Actor[]>;
}
