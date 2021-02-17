import { useCallback, useState } from 'react';

export const useInput = (initValue = '') => {
    const [value, setValue] = useState(initValue);

    const resetInput = useCallback(() => {
        setValue('');
    }, [setValue]);

    const onChange = useCallback((event) => {
        setValue(event.currentTarget.value);
    }, [setValue]);

    return {
        resetInput,
        value,
        bind: {
            value,
            onChange
        },
        setValue
    }
}