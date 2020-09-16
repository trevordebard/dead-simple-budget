import { use, schema } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { getUserId } from '../auth/utils'
import { setCookie } from '../auth/cookies';

use(prisma({ features: { crud: true } }));

schema.addToContext(({ req, res }) => {
  return {
    //@ts-ignore
    sendCookie: req.sendCookie,
    req,
    res,
  }
})

schema.objectType({
  name: "user",
  definition(t) {
    t.model.id();
    t.model.created_at();
    t.model.email();
    t.model.budget();
    t.model.transactions();
  }
})

schema.objectType({
  name: "budget",
  definition(t) {
    t.model.id()
    t.model.toBeBudgeted()
    t.model.total()
    t.model.userId()
    t.model.stacks()
  },
})

schema.objectType({
  name: "transactions",
  definition(t) {
    t.model.amount()
    t.model.description()
    t.model.id()
    t.model.stack()
    t.model.type()
    t.model.userId()
    t.model.date()
  }
})

schema.objectType({
  name: "stacks",
  definition(t) {
    t.model.id()
    t.model.label()
    t.model.amount()
    t.model.budgetId()
  }

})

schema.queryType({
  definition(t) {
    t.crud.user();
    t.crud.budget();
    t.crud.transactions();
    t.crud.users();
    t.crud.budgets();
    t.crud.stacks();
    t.field('me', {
      type: 'user',
      async resolve(_root, _args, ctx) {
        let pris = ctx.db
        const userId = getUserId(ctx.token)
        let me = await pris.user.findOne({ where: { id: userId } })
        return me;
      },
    })
  }
})
schema.objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'user' })
  },
})
schema.mutationType({
  definition(t) {
    t.crud.updateOnebudget(),
      t.crud.updateOnestacks(),
      t.crud.createOnestacks(),
      t.field('signup', {
        type: 'AuthPayload',
        args: {
          name: schema.stringArg(),
          email: schema.stringArg({ nullable: false }),
          password: schema.stringArg({ nullable: false }),
        },
        resolve: async (_parent, { name, email, password }, ctx) => {
          const hashedPassword = await hash(password, 10)
          const user = await ctx.db.user.create({
            data: {
              email,
              password: hashedPassword,
              budget: {
                create: {
                  total: 0,
                  toBeBudgeted: 0,
                }
              }
            },
          })
          const token = sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "5 days" });
          // @ts-ignore
          setCookie(ctx.res, 'token', token)
          return {
            token,
            user,
          }
        },
      })
  }
})
schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        //Check if user exists
        let user;
        try {
          user = await ctx.db.user.findOne({
            where: {
              email: email
            }
          });
        } catch (e) {
          console.error(e)
          throw new Error(`There was a problem finding user with email: ${email}`)
        }
        const passwordMatches = await compare(password, user.password)
        if (passwordMatches) {
          const token = sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "5 days" });
          // @ts-ignore
          setCookie(ctx.res, 'token', token)
          return {
            user
          }
        }
        console.error(`Email: ${email} attempted login with incorrect password.`)
        throw new Error(`There was a problem finding user with email: ${email}`)
      },
    })
  }
})
