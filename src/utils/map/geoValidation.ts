// 주소가 대한민국이면 참 리턴
export const isSouthKorea = (address: string): boolean => {
    return /대한민국/.test(address);
};