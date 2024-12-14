document.addEventListener("DOMContentLoaded", () => {
    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.inOut"
        }
    })

    timeline.to(".pl-text", {
        opacity: 1,
        delay: 0.8
    }).add(() => {
        timeline.to(".pl-text", {
            opacity: 0,
            y: -25,
            delay: 3,
            onUpdate: () => {
                timeline.to("[data-hide]", {
                    stagger: {
                        amount: 1,
                        from: "start"
                    },
                    opacity: 1,
                    y: 0,
                    onUpdate: () => {
                        gsap.to("nav a", {
                            y: 0,
                            opacity: 1
                        })
                    }
                })
            }
        })
    })
})