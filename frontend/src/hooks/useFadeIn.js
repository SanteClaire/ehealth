import { useEffect } from 'react'

export function useFadeIn() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                        // Une fois visible, on arrête d'observer (perf + reste visible)
                        observer.unobserve(entry.target)
                    }
                })
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px' // déclenche 60px avant le bord bas
            }
        )

        const elements = document.querySelectorAll('.fade-in')
        elements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])
}
