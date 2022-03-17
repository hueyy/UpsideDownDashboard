if (process.env.NODE_ENV !== `production`) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(`dotenv`).config()
}
import 'reflect-metadata'
import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import Fronius from './lib/Fronius'

const app = fastify({ logger: true })

app.register(fastifyCors, {

})

app.get(`/`, async (req, reply) => {
  return { hello: `world` }
})

app.get(`/data`, async (req, reply) => {
  return await Fronius.getDataFromInverters()
})

const start = async () => {
  try {
    await app.listen(3000, `::`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()