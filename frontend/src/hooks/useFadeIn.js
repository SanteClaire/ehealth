import { useEffect } from 'react'

export function useFadeIn() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.15 }
        )

        const elements = document.querySelectorAll('.fade-in')
        elements.forEach((el) => observer.observe(el))

        return () => {
            elements.forEach((el) => observer.unobserve(el))
        }
    }, [])
}
