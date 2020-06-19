import * as ec from "react-native-ecc";
import { Buffer } from "buffer";

// Scheme to be used until others are added.
export const SCHEME = "ecdsa-secp256r1";

// More schemes can be added later on.
export const AVAILABLE_SCHEMES = ["ecdsa-secp256r1"];

// if you want to be able to find your keys
// next time, make sure to use the same service IDe
try {
  ec.setServiceID("sikobaApp");
} catch (e) {
  console.log(e);
}

export const sign = (msg, pubKey, onSigned) => {
  const message = new Buffer(msg);
  const key = ec.keyFromPublic(new Buffer(pubKey));
  key.sign(
    {
      data: message,
      algorithm: "sha256",
    },
    function(err, sig) {
      if (onSigned && typeof onSigned === "function") onSigned(sig);

      // key.verify(
      //   {
      //     algorithm: "sha256",
      //     data: message,
      //     sig: sig,
      //   },
      //   function(err, verified) {
      //     console.log("verified:", verified);
      //   }
      // );
    }
  );
};

export const createKey = (onSuccess) => {
  const curve = "p256";
  ec.keyPair(curve, function(err, key) {
    const pubKey = key.pub;

    if (onSuccess && typeof onSuccess === "function") onSuccess(pubKey);
  });
};
