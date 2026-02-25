import { useEffect } from 'react'

export function useNavScroll(navRef) {
    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                navRef.current.classList.toggle('scrolled', window.scrollY > 20)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [navRef])
}
