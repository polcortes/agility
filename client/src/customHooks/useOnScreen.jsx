import { useState, useEffect, useRef } from 'react';

const useOnScreen = (ref) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const observer = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        observer.current = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting);
        });

        observer.current.observe(ref.current);

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [ref]);

    return isIntersecting;
};

export default useOnScreen;
