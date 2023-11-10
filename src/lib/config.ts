import { ev } from './utils/env'

export default {
    SPEC_API_ORIGIN: ev('SPEC_API_ORIGIN', 'https://api.spec.dev'),
    RESPONSE_TIMEOUT: Number(ev('QUERY_REQUEST_TIMEOUT', 30000)),
    NAMESPACE_AUTH_HEADER_NAME: 'Spec-Namespace-Auth-Token',
}
