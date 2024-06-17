const z = require('zod')

const movieSchema = z.object({
  nombre: z.string({
    invalid_type_error: 'El nombe tiene que ser un string',
    required_error: 'El nombre es requerido'
  }),
  email: z.string(),
  contrasena: z.string(),
  activo: z.boolean()
})

function validateSchema (object) {
  return movieSchema.safeParse(object)
}

function validatePartial (input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = { validateSchema, validatePartial }
