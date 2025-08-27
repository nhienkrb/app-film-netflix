const joi = require("joi");
const { MaturityLevelEnum } = require("../enums/maturity");

const email = joi.string() .email({ minDomainSegments: 2, tlds: { allow: ["com"] } }).required();
const display_name = joi.string().min(3).max(100).required();
const password = joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required();;
const name = joi.string().min(3).max(100).required();
const maturity_level = joi.string().valid(...Object.values(MaturityLevelEnum)).required();  
  
module.exports = { email, password,display_name,name,maturity_level };
