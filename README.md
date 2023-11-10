# Spec Ecosystem Client

JavaScript client to interface with resources in the Spec ecosystem.

## Requirements

* Node.js >= 16
* npm >= 8

## Installation

```bash
$ npm install @spec.dev/ecosystem
```

## Auth

In order to make changes within your namespace on Spec, you will first need a **namespace access token**. 

It's important to keep this token private — and because of this, any write operations performed by this library should be initiated on the server-side, with your token stored as an environment variable.

## Client

Creating a new instance of the ecosystem client is simple.

```typescript
import { SpecEcosystemClient } from '@spec.dev/ecosystem'

const spec = new SpecEcosystemClient({
    namespaceToken: process.env.SPEC_NAMESPACE_TOKEN
})
```

## Contract Group Operations

Currently, this library can be used:

1. Create new contract groups
2. Add new contracts to an existing group

### Creating contract groups

```javascript
const group = 'namespace.ContractName'
const chainIds = [1, 5, 137, ...] // chain ids for the group
const abi = [{ type: 'event', name: 'Transfer', ... }, ...]

const { ok, error } = await spec.createContractGroup(group, chainIds, abi)
```

### Adding contracts to a group

> [!NOTE]
> The contract group *must exist* before using this method to add contracts to it.

Currently, only a single chain can be used per API call. This may change in the near future, so stay tuned.

```javascript
const group = 'namespace.ContractName'
const chainId = 5
const addresses = ['0x123...', '0x456...']

const { ok, error } = await spec.addContractsToGroup(group, chainId, addresses)
```

## License

MIT