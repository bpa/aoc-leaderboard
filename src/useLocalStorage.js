import { useEffect, useState } from 'react';

function useLocalStorage(key, default_value) {
    const [value, setValue] = useState(() => {
        return localStorage.getItem(key) || default_value;
    })

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;