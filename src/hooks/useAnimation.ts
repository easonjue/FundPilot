import { useRef, useCallback, useEffect } from 'react'
import {
  fadeIn,
  fadeOut,
  fadeInUp,
  fadeInDown,
  scaleIn,
  scaleOut,
  slideInLeft,
  slideInRight,
  elasticIn,
  shake,
  pulse,
  addAnimationClass,
  prefersReducedMotion,
  AnimationOptions,
} from '@/utils/animations'

export interface UseAnimationReturn {
  ref: React.RefObject<HTMLElement>
  fadeIn: (options?: AnimationOptions) => Promise<void>
  fadeOut: (options?: AnimationOptions) => Promise<void>
  fadeInUp: (options?: AnimationOptions) => Promise<void>
  fadeInDown: (options?: AnimationOptions) => Promise<void>
  scaleIn: (options?: AnimationOptions) => Promise<void>
  scaleOut: (options?: AnimationOptions) => Promise<void>
  slideInLeft: (options?: AnimationOptions) => Promise<void>
  slideInRight: (options?: AnimationOptions) => Promise<void>
  elasticIn: (options?: AnimationOptions) => Promise<void>
  shake: (options?: AnimationOptions) => Promise<void>
  pulse: (options?: AnimationOptions) => Promise<void>
  addAnimationClass: (className: string, duration?: number) => Promise<void>
  isReducedMotion: boolean
}

/**
 * 动画Hook
 */
export const useAnimation = (): UseAnimationReturn => {
  const ref = useRef<HTMLElement>(null)
  const isReducedMotion = prefersReducedMotion()

  const createAnimationMethod = useCallback(
    (animationFn: (element: HTMLElement, options?: AnimationOptions) => Animation) =>
      async (options?: AnimationOptions): Promise<void> => {
        if (!ref.current || isReducedMotion) return Promise.resolve()

        const animation = animationFn(ref.current, options)
        await animation.finished
      },
    [isReducedMotion]
  )

  const animationMethods = {
    fadeIn: createAnimationMethod(fadeIn),
    fadeOut: createAnimationMethod(fadeOut),
    fadeInUp: createAnimationMethod(fadeInUp),
    fadeInDown: createAnimationMethod(fadeInDown),
    scaleIn: createAnimationMethod(scaleIn),
    scaleOut: createAnimationMethod(scaleOut),
    slideInLeft: createAnimationMethod(slideInLeft),
    slideInRight: createAnimationMethod(slideInRight),
    elasticIn: createAnimationMethod(elasticIn),
    shake: createAnimationMethod(shake),
    pulse: createAnimationMethod(pulse),
  }

  const addAnimationClassMethod = useCallback(
    async (className: string, duration?: number): Promise<void> => {
      if (!ref.current || isReducedMotion) return Promise.resolve()

      await addAnimationClass(ref.current, className, duration)
    },
    [isReducedMotion]
  )

  return {
    ref,
    ...animationMethods,
    addAnimationClass: addAnimationClassMethod,
    isReducedMotion,
  }
}

/**
 * 进入动画Hook
 */
export const useEnterAnimation = (
  animationType:
    | 'fadeIn'
    | 'fadeInUp'
    | 'fadeInDown'
    | 'scaleIn'
    | 'slideInLeft'
    | 'slideInRight'
    | 'elasticIn' = 'fadeInUp',
  options?: AnimationOptions & { delay?: number }
) => {
  const { ref, [animationType]: animate } = useAnimation()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // 初始隐藏元素
    element.style.opacity = '0'

    const timer = setTimeout(() => {
      element.style.opacity = '1'
      animate(options)
    }, options?.delay || 0)

    return () => clearTimeout(timer)
  }, [animate, options])

  return ref
}

/**
 * 悬停动画Hook
 */
export const useHoverAnimation = (
  hoverAnimation: 'pulse' | 'shake' | 'scaleIn',
  options?: AnimationOptions
) => {
  const { ref, [hoverAnimation]: animate } = useAnimation()

  const handleMouseEnter = useCallback(() => {
    animate(options)
  }, [animate, options])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [handleMouseEnter])

  return ref
}

/**
 * 滚动触发动画Hook
 */
export const useScrollAnimation = (
  animationType: 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' = 'fadeInUp',
  options?: AnimationOptions & { threshold?: number; rootMargin?: string }
) => {
  const { ref, [animationType]: animate } = useAnimation()

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return

    // 初始隐藏元素
    element.style.opacity = '0'

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            element.style.opacity = '1'
            animate(options)
            observer.unobserve(element)
          }
        })
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '0px',
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [animate, options])

  return ref
}

/**
 * 交错动画Hook（用于列表项）
 */
export const useStaggerAnimation = (
  animationType: 'fadeInUp' | 'fadeInDown' | 'slideInLeft' | 'slideInRight' = 'fadeInUp',
  staggerDelay: number = 100
) => {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const children = Array.from(container.children) as HTMLElement[]

    children.forEach((child, index) => {
      child.style.opacity = '0'

      setTimeout(() => {
        child.style.opacity = '1'
        child.classList.add(`animate-${animationType}`)

        // 清理动画类
        const handleAnimationEnd = () => {
          child.classList.remove(`animate-${animationType}`)
          child.removeEventListener('animationend', handleAnimationEnd)
        }

        child.addEventListener('animationend', handleAnimationEnd)
      }, index * staggerDelay)
    })
  }, [animationType, staggerDelay])

  return containerRef
}

/**
 * 页面切换动画Hook
 */
export const usePageTransition = () => {
  const { ref, fadeIn: fadeInAnimation, fadeOut: fadeOutAnimation } = useAnimation()

  const fadeIn = useCallback(async () => {
    if (ref.current) {
      ref.current.style.opacity = '0'
      await fadeInAnimation({ duration: 300 })
    }
  }, [fadeInAnimation])

  const fadeOut = useCallback(async () => {
    await fadeOutAnimation({ duration: 300 })
  }, [fadeOutAnimation])

  return {
    ref,
    fadeIn,
    fadeOut,
  }
}

export default useAnimation
