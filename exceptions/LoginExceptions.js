function InvalidCredentialsException() {
  const error = new Error("Invalid credentials.");
  return error;
}
InvalidCredentialsException.prototype = Object.create(Error.prototype);

function DeviceNotRegisteredException() {
  const error = new Error("Device not registered.");
  error.code = 104;
  return error;
}
DeviceNotRegisteredException.prototype = Object.create(Error.prototype);

function InvalidSignatureException() {
  const error = new Error("Invalid login signature.");
  return error;
}
InvalidSignatureException.prototype = Object.create(Error.prototype);

export default {
  InvalidCredentialsException,
  DeviceNotRegisteredException,
  InvalidSignatureException,
};
