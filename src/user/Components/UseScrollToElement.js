import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UseScrollToElement = () => {
    // Function to scroll to the Card element
    const location1 = useLocation();
    useEffect(() => {
        const scrollToElement = () => {
            const { search } = location1;
            const params = new URLSearchParams(search);
            const scrollToId = params.get('');

            if (scrollToId) {
                const element = document.getElementById(scrollToId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        scrollToElement();
    }, [location1]);

};

export default UseScrollToElement;
