export default interface KeyValueDto {
    key: string,
    value: string,
}

export function isKeyValueDto(obj: unknown): obj is KeyValueDto {
    return Boolean(obj) &&
            Object.prototype.hasOwnProperty.call(obj, 'key')
            && Object.prototype.hasOwnProperty.call(obj, 'value')
}