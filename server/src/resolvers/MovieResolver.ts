import { Arg, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Movie } from '../entities';
import { isAuth } from '../middleware';

@InputType()
class DirectorInput {
	@Field()
	id: string
}

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

	@Field(() => DirectorInput, { nullable: true })
	director: {
		id: string
	};
}

@InputType()
class MovieCreateInput extends MovieUpdateInput {
	@Field()
	title: string;

	@Field(() => Int)
	minutes: number;

	@Field(() => DirectorInput, { nullable: true })
	director: {
		id: string
	};
}

@InputType()
class MovieQueryInput extends MovieUpdateInput {
	@Field(() => String, { nullable: true })
	id?: string;
}

@Resolver()
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

	@Query(() => [Movie])
	@UseMiddleware(isAuth)
	async movies(@Arg('options', () => MovieQueryInput, { nullable: true }) options: MovieQueryInput) {
		return await Movie.find(options);
	}
}
