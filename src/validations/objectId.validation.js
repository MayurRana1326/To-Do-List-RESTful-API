const Joi = require("joi");

module.exports = Joi.string().hex().length(24).required().messages({
    'string.hex': 'Invalid ObjectId format. It should be a hexadecimal string.',
    'string.length': 'ObjectId must be exactly 24 characters long.',
    'any.required': 'ObjectId is required.',
});
