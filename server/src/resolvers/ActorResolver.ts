import { Arg, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Actor } from '../entities';
import { isAuth } from '../middleware';

@InputType()
class ActorUpdateInput {
	@Field(() => String, { nullable: true })
	firstName?: string;

	@Field(() => String, { nullable: true })
	lastName?: string;

	@Field(() => Int, { nullable: true })
	age?: number;
}

@InputType()
class ActorCreateInput {
	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field(() => Int)
	age: number;
}

@InputType()
class ActorQueryInput extends ActorUpdateInput {
	@Field(() => String, { nullable: true })
	id?: string;
}

@Resolver(() => Actor)
export class ActorResolver {
	@Mutation(() => Actor)
	@UseMiddleware(isAuth)
	async createActor(
		@Arg('input', () => ActorCreateInput)
		options: ActorCreateInput
	) {
		const actor = await Actor.create(options).save();
		return actor;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async updateActor(@Arg('id') id: string, @Arg('input', () => ActorUpdateInput) input: ActorUpdateInput) {
		await Actor.update({ id }, input);
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async deleteActor(@Arg('id') id: string) {
		await Actor.delete({ id });
		return true;
	}

	@Query(() => [Actor])
	@UseMiddleware(isAuth)
	async actors(@Arg('options', () => ActorQueryInput, { nullable: true }) options: ActorQueryInput) {
		const actors = await Actor.find(options);
		console.log(actors);
		return actors;
	}

	@Query(() => Actor, { nullable: true })
	@UseMiddleware(isAuth)
	async actor(@Arg('id', () => String) id: string) {
		return await Actor.findOne({ id });
	}
}
