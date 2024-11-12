export const baseFetch = async (path: `${string}`, option?: RequestInit) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
        ...option
    });

    return response;
}