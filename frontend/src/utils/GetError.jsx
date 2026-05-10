export const getError = (err) => {
    if (!err) return "Có lỗi xảy ra";

    if (typeof err === "string") return err;

    if (err instanceof Error) return err.message;

    if (typeof err === "object") {
        return Object.values(err).flat();
    }

    return "Có lỗi xảy ra";
};