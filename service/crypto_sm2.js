const sjcl = require('brdc-sjcl')
const sm2 = require('brdc-sm-crypto').sm2
const sm3 = require('brdc-sm-crypto').sm3
const crypto_sm2 = {}

crypto_sm2._bytesToHex = (bytes) => {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16))
        hex.push((bytes[i] & 0xF).toString(16))
    }
    return hex.join('')
}

const Hexstring2btye = (str) => {
    let pos = 0
    let len = str.length
    if (len % 2 !== 0) {
        return null
    }
    len /= 2
    let hexA = []
    for (let i = 0; i < len; i++) {
        let s = str.substr(pos, 2)
        let v = parseInt(s, 16)
        hexA.push(v)
        pos += 2
    }
    return hexA
}

crypto_sm2._parseRawPrivateKey = (encodePrivateKey) => {
    const decodedKey = sjcl.codec.base58.decode(encodePrivateKey)
    return decodedKey.slice(5, decodedKey.length)
}

crypto_sm2._parseRawPublicKey = (encodePublicKey) => {
    const keyBytes = sjcl.codec.bytes.fromBits(
        sjcl.codec.hex.toBits(encodePublicKey))
    return keyBytes.slice(3, keyBytes.length)
}

crypto_sm2._createPrivateKey = (rawPrivateKey) => {
    const prefix = [0x18, 0x9E, 0x99]
    const version = [0x7A, 0x66]
    const head = sjcl.bitArray.concat(prefix, version)
    let mix = sjcl.bitArray.concat(head, rawPrivateKey)
    return sjcl.codec.base58.encode(mix)
}

crypto_sm2._createPublicKey = (rawPublicKey) => {
    const prefix = [0xb0]
    const version = [0x7A, 0x66]
    const head = sjcl.bitArray.concat(prefix, version)
    const mix = sjcl.bitArray.concat(head, rawPublicKey)
    return sjcl.codec.hex.fromBits(sjcl.codec.bytes.toBits(mix))
}

crypto_sm2.hash = (bitString) => {
    return Hexstring2btye(sm3(bitString))
}

crypto_sm2._createAddress = (rawPublicKey, chainCode) => {
    // const head = [0x1];
    let ar = crypto_sm2.hash(rawPublicKey)
    let mix = ar.slice(10)
    // mix = sjcl.bitArray.concat(head, mix)
    let address = sjcl.codec.base58.encode(mix)
    if (chainCode) {
        return `did:bid:${chainCode}:zf${address}`
    }
    return `did:bid:zf${address}`
}

crypto_sm2.privateToPublic = (privateKey) => {

    const rawPrivateKey = crypto_sm2._parseRawPrivateKey(privateKey)
    const rawPublicKey = Hexstring2btye(sm2.getPublicKeyFromPrivateKey(crypto_sm2._bytesToHex(rawPrivateKey)))
    return crypto_sm2._createPublicKey(rawPublicKey)
}

crypto_sm2.publicToAddress = (publicKey) => {
    const rawPublicKey = crypto_sm2._parseRawPublicKey(publicKey)
    return crypto_sm2._createAddress(rawPublicKey)
}

crypto_sm2.privateToAccount = (encPrivateKey) => {
    const encPublicKey = crypto_sm2.privateToPublic(encPrivateKey)
    const encAddress = crypto_sm2.publicToAddress(encPublicKey)
    const rawPrivateKey = crypto_sm2._parseRawPrivateKey(encPrivateKey)
    const rawPublicKey = Hexstring2btye(sm2.getPublicKeyFromPrivateKey(crypto_sm2._bytesToHex(rawPrivateKey)))
    return {
        encPrivateKey,
        encPublicKey,
        encAddress,
        rawPrivateKey,
        rawPublicKey
    }
}

crypto_sm2.generate = (chainCode) => {
    let keypair = sm2.generateKeyPairHex()

    const rawPrivateKey = Hexstring2btye(keypair.privateKey)
    const rawPublicKey = Hexstring2btye(keypair.publicKey)

    // create privateKey
    const privateKey = crypto_sm2._createPrivateKey(rawPrivateKey)
    // create publicKey
    const publicKey = crypto_sm2._createPublicKey(rawPublicKey)
    // create address
    const address = crypto_sm2._createAddress(rawPublicKey, chainCode)

    return {
        privateKey,
        publicKey,
        address
    }
}

crypto_sm2.generateByPub = (encPublicKey) => {
    const rawPublicKey = crypto_sm2._parseRawPublicKey(encPublicKey)
    // create address
    const encAddress = crypto_sm2._createAddress(rawPublicKey)

    return {
        encPublicKey,
        encAddress,
        rawPublicKey
    }
}
crypto_sm2.generateChild = (rawPrivatekey, chainCode, serviceType, index) => {

    let path = '/0/' + chainCode + '/' + serviceType + '/' + index.toString()
    const rawPrivateKey = crypto_sm2.hash(rawPrivatekey + path)
    const rawPublicKey = Hexstring2btye(sm2.getPublicKeyFromPrivateKey(crypto_sm2._bytesToHex(rawPrivateKey)))

    // create privateKey
    const privateKey = crypto_sm2._createPrivateKey(rawPrivateKey)
    // create publicKey
    const publicKey = crypto_sm2._createPublicKey(rawPublicKey)
    // create address
    const address = crypto_sm2._createAddress(rawPublicKey, chainCode)

    return {
        privateKey,
        publicKey,
        address,
        path
    }
}

crypto_sm2.sign = (message, privateKey) => {

    if (typeof message === 'number') {
        message = message + ''
    }

    const buffer = Hexstring2btye(message)
    let sigValueHex = sm2.doSignature(buffer, crypto_sm2._bytesToHex(crypto_sm2._parseRawPrivateKey(privateKey)), { hash: true }) // 签名
    return sigValueHex
}

/**
 * Verify the signature
 *
 * @param  {String} message
 * @param  {String} signature
 * @param  {String} publicKey
 * @returns {Boolean}
 */
crypto_sm2.verify = (message, signature, publicKey) => {
    if (typeof message === 'number') {
        message = message + ''
    }
    if (typeof signature !== 'string') {
        throw new TypeError('signature must be a string')
    }

    const buffer = Hexstring2btye(message)
    let verifyResult = sm2.doVerifySignature(buffer, signature, crypto_sm2._bytesToHex(crypto_sm2._parseRawPublicKey(publicKey)), { hash: true }) // 验签结果
    return verifyResult
}

module.exports = crypto_sm2


