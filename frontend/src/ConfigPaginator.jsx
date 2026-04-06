export const configPaginator = (data, currentPage, pageSize) => {
    const totalPages = Math.ceil(data.length / pageSize)

    const pageItems = data.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    return {
        totalPages,
        pageItems
    }
}