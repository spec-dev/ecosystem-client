export const paths = {
    CONTRACT_GROUP: '/contract/group',
}

export const newUrl = (origin: string, path: string): string => {
    const url = new URL(origin)
    url.pathname = path
    return url.toString()
}

export const urls = {
    contractGroup: (origin: string) => newUrl(origin, paths.CONTRACT_GROUP),
    addContractToGroup: (origin: string) => newUrl(origin, paths.CONTRACT_GROUP + '/add'),
}
