const {
  ApiResponse: { validationError },
} = require("../responses");

module.exports = {
  typeCheck:
    (types, paramsName = "type") =>
    async (req, res, next) => {
      const type =
        paramsName == "type"
          ? req.params.type
            ? req.params.type
            : req.query.type
          : req.query[paramsName];

      if (!types.includes(type)) {
        return res
          .status(422)
          .send(
            validationError(
              0,
              `Invalid ${paramsName}. Must be one of: ${types}`
            )
          );
      }
      next();
    },
};
