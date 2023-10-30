![DIF Logo](https://raw.githubusercontent.com/decentralized-identity/universal-registrar/master/docs/logo-dif.png)

# Universal Registrar Driver: bid

This is a  [Universal Registrar](https://hub.docker.com/repository/docker/caictdevelop/uni-registrar-driver-did-bid/) driver for  **did:bid** identifiers.

## Specifications

* [Decentralized Identifiers](https://w3c.github.io/did-core/)
* [DID Method Specification](https://github.com/teleinfo-bif/bid/blob/master/doc/en/BID%20Protocol%20Specification.md)

## Build and Run (Docker)

```
docker build -f ./docker/Dockerfile . -t caictdevelop/uni-registrar-driver-did-bid
docker run -p 9080:9080 -d caictdevelop/uni-registrar-driver-did-bid
```

## Driver Environment Variables

 * `(none)`

## Driver Input Options

/create

```
{
  "jobId": "6d85bcd0-2ea3-4288-ab00-15afadd8a156",
  "options": {
    "chain": "TESTNET",
    "keyType": "Ed25519"
  },
  "secret": {},
  "didDocument": {}
}
```

- `chain`: The type of key to generate. Values: `TESTNET`, `MAINNET`
- `keyType`: The type of key to generate. Values: `Ed25519`, `SM2`

/update

```
{
  "jobId": "6d85bcd0-2ea3-4288-ab00-15afadd8a156",
  "identifier": "did:bid:ef7zyvBtyg22NC4qDHwehMJxeqw6Mmrh",
  "options": {
    "chain": "TESTNET"
  },
  "secret": {},
  "didDocument": {}
}
```

`chain`: The type of key to generate. Values: `TESTNET`, `MAINNET`

/deactivate

```
{
  "jobId": "6d85bcd0-2ea3-4288-ab00-15afadd8a156",
  "identifier": "did:bid:ef7zyvBtyg22NC4qDHwehMJxeqw6Mmrh",
  "options": {
    "chain": "TESTNET"
  },
  "secret": {}
}
```

`chain`: The type of key to generate. Values: `TESTNET`, `MAINNET`

## Driver Metadata

* `(none)`
