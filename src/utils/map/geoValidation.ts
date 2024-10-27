export const isSouthKorea = (address: string): boolean => {
    return /대한민국/.test(address);
};
