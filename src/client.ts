import config from './lib/config'
import { SpecEcosystemClientOptions, StringKeyMap, AuthOptions, CallResponse } from './lib/types'
import codes from './lib/utils/codes'
import { urls } from './lib/utils/paths'
import fetch from 'cross-fetch'

const DEFAULT_OPTIONS = {
    origin: config.SPEC_API_ORIGIN,
}

/**
 * Spec Ecosystem Client.
 *
 * A Javascript client for interfacing with the Spec ecosystem.
 */
class SpecEcosystemClient {
    protected origin: string
    protected namespaceToken: string

    get baseHeaders(): StringKeyMap {
        return {
            'Content-Type': 'application/json',
        }
    }

    /**
     * Create a new client instance.
     */
    constructor(options?: SpecEcosystemClientOptions) {
        const settings = { ...DEFAULT_OPTIONS, ...options }
        this.origin = settings.origin
        this.namespaceToken = options.namespaceToken
    }

    /**
     * Create a new contract group.
     */
    async createContractGroup(
        group: string,
        chainIds: string[] | number[],
        abi: StringKeyMap[]
    ): Promise<CallResponse> {
        const [nsp, name] = group.split('.')
        const payload = { nsp, name, chainIds, abi }
        const authOptions = { namespaceToken: this.namespaceToken }
        return this._post(urls.contractGroup(this.origin), payload, authOptions)
    }

    /**
     * Add contract addresses to an existing contract group.
     */
    async addContractsToGroup(
        group: string,
        chainId: string | number,
        addresses: string[]
    ): Promise<CallResponse> {
        const [nsp, name] = group.split('.')
        const instances = addresses.map((address) => ({
            address,
        }))
        const payload = { nsp, name, chainId, instances }
        const authOptions = { namespaceToken: this.namespaceToken }
        return this._post(urls.addContractToGroup(this.origin), payload, authOptions)
    }

    /**
     * Perform HTTP request with timeout protection.
     */
    async _post(
        url: string,
        payload: StringKeyMap | StringKeyMap[],
        authOptions: AuthOptions | null
    ): Promise<CallResponse> {
        const abortController = new AbortController()
        const timer = setTimeout(() => abortController.abort(), config.RESPONSE_TIMEOUT)

        // Perform HTTP request.
        let resp
        try {
            resp = await fetch(url, {
                method: 'POST',
                headers: this._buildHeaders(authOptions),
                body: JSON.stringify(payload),
                signal: abortController.signal,
            })
        } catch (err) {
            clearTimeout(timer)
            const message = err.message || err.toString() || ''
            const didTimeout = message.toLowerCase().includes('user aborted')
            return {
                ok: false,
                code: didTimeout ? codes.TIMEOUT : codes.INTERNAL_ERROR,
                error: didTimeout ? 'Request timed out' : `Error making request: ${err}`,
                data: {},
            }
        }
        clearTimeout(timer)

        // Parse JSON Response.
        let data: StringKeyMap | StringKeyMap[]
        try {
            data = await resp.json()
        } catch (err) {
            return {
                ok: false,
                code: codes.CLIENT_ERROR,
                error: `Failed to parse JSON response data: ${err}`,
                data: {},
            }
        }

        // Return propertly formatted error if given response error.
        const code = resp.status
        if (code !== codes.SUCCESS) {
            return {
                ok: false,
                code,
                error: (data || {}).error,
                data: {},
            }
        }

        return { ok: true, code, data }
    }

    /**
     * Build final request headers with optional auth token.
     */
    _buildHeaders(authOptions: AuthOptions | null): StringKeyMap {
        const baseHeaders = this.baseHeaders
        return authOptions?.namespaceToken
            ? {
                  ...baseHeaders,
                  [config.NAMESPACE_AUTH_HEADER_NAME]: authOptions.namespaceToken,
              }
            : baseHeaders
    }
}

export default SpecEcosystemClient
