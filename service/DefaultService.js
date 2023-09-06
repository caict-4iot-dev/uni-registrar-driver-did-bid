'use strict';
const account = require('./keyPair')
const crypto_sm2 = require('./crypto_sm2')
/**
 * Creates a DID.
 *
 * body CreateRequest  (optional)
 * returns CreateState
 **/
exports.create = function(body) {
  const type = body.options.keyType || 'Ed25519';
  const chain = body.options.chain || 'TESTNET';
  const jobId = body.jobId ;
  return new Promise(function(resolve, reject) {
    try {

      if (!(chain === 'TESTNET'||chain === 'MAINNET'))
        resolve({code: 500, payload: 'invalid chain'});

    const generateOptions = {
      keyPair: () => {
        if (type === 'Ed25519')
          return  account.generate();
        else if(type === 'SM2')
          return crypto_sm2.generate();
        else
         // throw new Error('invalid type')
        resolve({code: 500, payload: 'invalid keyType'});
      }
    };
    const keyPair =generateOptions.keyPair()
    console.log(JSON.stringify(keyPair));
    var response = {
      "jobId" : jobId,
      "didState" : {
        "identifier" : keyPair.address,
        "state" : "finished",
        "chain": chain,
        "secret" : {
          "keys" : [ {
            "type":type,
            "privateKey" : keyPair.privateKey,
            "publicKey" : keyPair.publicKey
          } ]
        }
      }
    };
    resolve(response);
    } catch (e) {
      console.log("ERROR: " + e);
      resolve({code: 500, payload: '' + e});
    }
  });
}


/**
 * Updates a DID.
 *
 * body UpdateRequest  (optional)
 * returns UpdateState
 **/
exports.update = function (body) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });
}

/**
 * Deactivates a DID.
 *
 * body DeactivateRequest  (optional)
 * returns DeactivateState
 **/
exports.deactivate = function (body) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });
}


