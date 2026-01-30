const ENCRYPTION_KEY = 'onboarding_app_secure_key_v1';

const xorCipher = (text: string, key: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(
            text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }
    return result;
};

export const encryptData = (data: string): string => {
    try {
        const obfuscated = xorCipher(data, ENCRYPTION_KEY);
        return btoa(obfuscated);
    } catch {
        return '';
    }
};

export const decryptData = (encryptedData: string): string => {
    try {
        const obfuscated = atob(encryptedData);
        return xorCipher(obfuscated, ENCRYPTION_KEY);
    } catch {
        return '';
    }
};

export interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

export const encryptPaymentInfo = (info: PaymentInfo): PaymentInfo => {
    return {
        cardNumber: encryptData(info.cardNumber),
        expiryDate: encryptData(info.expiryDate),
        cvv: encryptData(info.cvv),
    };
};

export const decryptPaymentInfo = (info: PaymentInfo): PaymentInfo => {
    const isEncrypted = (str: string) => {
        if (!str) return false;
        try {
            atob(str);
            return str.length > 0 && !/^\d+$/.test(str) && !/^\d{2}\/\d{2}$/.test(str);
        } catch {
            return false;
        }
    };

    return {
        cardNumber: isEncrypted(info.cardNumber) ? decryptData(info.cardNumber) : info.cardNumber,
        expiryDate: isEncrypted(info.expiryDate) ? decryptData(info.expiryDate) : info.expiryDate,
        cvv: isEncrypted(info.cvv) ? decryptData(info.cvv) : info.cvv,
    };
};
