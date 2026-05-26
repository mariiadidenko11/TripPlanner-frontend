
import { useState, useEffect, useCallback, useRef } from 'react';

export function useApi(apiFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fnRef = useRef(apiFn);
   
    useEffect(() => {
        fnRef.current = apiFn;
    }, [apiFn]);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fnRef.current();
            setData(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
     
    }, deps);

    return { data, loading, error, refetch: fetch };
}
