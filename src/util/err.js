class customError extends Error {
    constructor(message, statusCode = 400, context = "") {
        super(message);
        this.error = message;
        this.statusCode = statusCode;
        this.context = context;
    }

    getMessage() {
        return `Error en ${this.context}: ${this.message}`;
    }
}

module.exports = customError;
