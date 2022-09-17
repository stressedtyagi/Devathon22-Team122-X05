// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
    /*  
        doing this `customError` functionality for those error that does not 
        come into our custom errors or anyother error
        we classify them into as INTERNAL_SERVER_ERROR
    */
    let customError = {
        // setDefault statuscode
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later",
    };

    /* 
        Now we don't need to do this for custom error since we are checking it while making the 
        custom error object above

        if (err instanceof CustomAPIError) {
            return res.status(err.statusCode).json({ msg: err.message });
        }
    */

    // Managing the cast error, for example if we messup with the `id` in the URL while making updateJob routes
    if (err.name === "CastError") {
        customError.msg = `No item found with id : ${err.value._id}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }

    // This is for validation error
    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    // This is for when we try to register a user with already existing email id
    if (err.code || err.code == 1100) {
        customError.msg = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please chose another value`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
