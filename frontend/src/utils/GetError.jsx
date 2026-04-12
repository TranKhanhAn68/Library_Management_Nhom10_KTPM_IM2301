export const getError = (err) => {
    if (typeof (err) === 'string')
        return err

    return Object.values(err)?.[0]?.[0] || 'Có lỗi xảy ra'

}