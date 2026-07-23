class AccessDeniedException extends Error {
  constructor(message) {
    super(message);
    this.name = "AccessDeniedException";
    Object.setPrototypeOf(this, AccessDeniedException.prototype);
  }
}

module.exports = { AccessDeniedException };
