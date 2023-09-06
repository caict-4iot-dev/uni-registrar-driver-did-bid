'use strict'

const nacl = require('./nacl')

const sjcl = require('brdc-sjcl')


/**
 * Create a single account, include privateKey publicKey and address
 *
 * @returns {Object}
 * @public
 */
function generate (chainCode) {
    const srcKeyPair = nacl.sign.keyPair()
    const seed = srcKeyPair.publicKey
    const keyPair = nacl.sign.keyPair.fromSeed(seed)
    const rawPrivateKey = Array.from(seed)
    const rawPublicKey = Array.from(keyPair.publicKey)

    // create privateKey
    const privateKey = _createPrivateKey(rawPrivateKey)
    // create publicKey
    const publicKey = _createPublicKey(rawPublicKey)
    // create address
    const address = _createAddress(rawPublicKey,chainCode)

    return {
        privateKey,
        publicKey,
        address
    }
}
/**
 * Create privateKey
 *
 * @param {Array} rawPrivateKey
 * @returns {String} output privateKey
 * @private
 */
function _createPrivateKey (rawPrivateKey) {
    const prefix = [0x18, 0x9E, 0x99]
    const version = [0x65, 0x66]
    const head = sjcl.bitArray.concat(prefix, version)
    let mix = sjcl.bitArray.concat(head, rawPrivateKey)
    return sjcl.codec.base58.encode(mix)
}

/**
 * Create publicKey
 *
 * @param {Array} rawPublicKey
 * @returns {String} output publicKey
 * @private
 */
function _createPublicKey (rawPublicKey) {
    const prefix = [0xb0]
    const version = [0x65, 0x66]
    const head = sjcl.bitArray.concat(prefix, version)
    const mix = sjcl.bitArray.concat(head, rawPublicKey)
    return sjcl.codec.hex.fromBits(sjcl.codec.bytes.toBits(mix))
}
/**
 * Create address
 *
 * @param {Array} rawPublicKey
 * @returns {String} output address
 * @private
 */
function _createAddress (rawPublicKey,chainCode) {
    // const head = [0x1];
    let mix = _sha256(rawPublicKey).slice(10)
    let address = sjcl.codec.base58.encode(mix)
    if(chainCode){
        return `did:bid:${chainCode}:ef${address}`
    }
    return `did:bid:ef${address}`
}
/**
 * Get sha256 hash string
 *
 * @param {String} bytes
 * @returns {String}
 * @private
 */
function _sha256 (bytes) {
    return sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(bytes)))
}
module.exports = {
    generate
}
