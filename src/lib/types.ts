export type StringKeyMap = { [key: string]: any }

export type StringMap = { [key: string]: string }

export type SpecEcosystemClientOptions = {
    origin?: string
    namespaceToken?: string
}

export type AuthOptions = {
    namespaceToken: string | null
}

export type CallResponse = {
    ok: boolean
    code: number
    data: StringKeyMap | StringKeyMap[]
    error?: string
}
