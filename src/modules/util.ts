const util = {
    success: (data?: any) => {
        return {
            data,
        };
    },
    fail: (data?: any) => {
        return {
        };
    },
};

export default util;