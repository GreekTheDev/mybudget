import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Default to false for SSR to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [hasMounted, setHasMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Mark as mounted to indicate we're now on the client
    setHasMounted(true)
    
    // Check initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Set up listener for changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Only return the actual value after mounting to ensure SSR and client render match
  return hasMounted ? isMobile : false
}
