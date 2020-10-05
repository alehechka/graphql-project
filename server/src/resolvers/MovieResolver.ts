import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Movie } from '../entities';

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
}

@InputType()
class MovieQueryInput extends MovieUpdateInput {
	@Field(() => String, { nullable: true })
	id?: string;
}

@Resolver()
export class MovieResolver {
	@Mutation(() => Movie)
	async createMovie(
		@Arg('input', () => MovieCreateInput)
		options: MovieCreateInput
	) {
		const movie = await Movie.create(options).save();
		return movie;
	}

	@Mutation(() => Boolean)
	async updateMovie(@Arg('id') id: string, @Arg('input', () => MovieUpdateInput) input: MovieUpdateInput) {
		await Movie.update({ id }, input);
		return true;
	}

	@Mutation(() => Boolean)
	async deleteMovie(@Arg('id') id: string) {
		await Movie.delete({ id });
		return true;
	}

	@Query(() => [Movie])
	async movies(@Arg('options', () => MovieQueryInput, { nullable: true }) options: MovieQueryInput) {
		return await Movie.find(options);
	}
}
