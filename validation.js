const Joi = require('joi')



//register validation

const registerValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    })

    const { error } = schema.validate(body);
    return error;
}

const loginValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    })

    const { error } = schema.validate(body);
    return error;
}


module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
