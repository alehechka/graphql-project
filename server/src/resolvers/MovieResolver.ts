import {
	Arg,
	Field,
	FieldResolver,
	InputType,
	Int,
	Mutation,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from 'type-graphql';
import { Actor, Director, Movie } from '../entities';
import { isAuth } from '../middleware';

@InputType()
class MovieUpdateInput {
	@Field(() => String, { nullable: true })
	title?: string;

	@Field(() => String, { nullable: true })
	subtitle?: string;

	@Field(() => Int, { nullable: true })
	minutes?: number;

	@Field(() => Int, { nullable: true })
	rating?: number;
}

@InputType()
class MovieCreateInput extends MovieUpdateInput {
	@Field()
	title: string;

	@Field(() => Int)
	minutes: number;

	@Field()
	directorId: string;
}

@InputType()
class MovieQueryInput extends MovieUpdateInput {
	@Field(() => String, { nullable: true })
	id?: string;
}

@Resolver(() => Movie)
export class MovieResolver {
	@Mutation(() => Movie)
	@UseMiddleware(isAuth)
	async createMovie(
		@Arg('input', () => MovieCreateInput)
		options: MovieCreateInput
	) {
		const movie = await Movie.create(options).save();
		return movie;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async updateMovie(@Arg('id') id: string, @Arg('input', () => MovieUpdateInput) input: MovieUpdateInput) {
		await Movie.update({ id }, input);
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deleteMovie(@Arg('id') id: string) {
		await Movie.delete({ id });
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async addActor(@Arg('actorId') actorId: string, @Arg('movieId') movieId: string) {
		try {
			const movie = await Movie.findOne({ id: movieId }, { relations: ['actors'] });
			const actor = await Actor.findOne({ id: actorId });
			const actors = await movie?.actors;
			console.log(actor, actors);
			movie!.actors = Promise.resolve([...actors!, actor!]);
			await movie!.save();
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async removeActor(@Arg('actorId') actorId: string, @Arg('movieId') movieId: string) {
		try {
			const movie = await Movie.findOne({ id: movieId }, { relations: ['actors'] });
			const actors = await movie?.actors;
			console.log(actors, actorId);
			movie!.actors = Promise.resolve(actors!.filter((actor) => actor.id !== actorId));
			await movie!.save();
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	@Query(() => [Movie])
	@UseMiddleware(isAuth)
	async movies(@Arg('options', () => MovieQueryInput, { nullable: true }) options: MovieQueryInput) {
		return await Movie.find(options);
	}

	@Query(() => Movie, { nullable: true })
	@UseMiddleware(isAuth)
	async movie(@Arg('id', () => String) id: string) {
		return await Movie.findOne({ id });
	}

	@FieldResolver()
	async director(@Root() movie: Movie) {
		return await Director.findOne({ id: movie.directorId });
	}
}
