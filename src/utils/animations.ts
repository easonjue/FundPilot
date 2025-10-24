// 动画工具函数

export interface AnimationOptions {
  duration?: number
  delay?: number
  easing?: string
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  iterationCount?: number
}

export interface TransitionOptions {
  duration?: number
  delay?: number
  easing?: string
  property?: string
}

/**
 * 创建CSS动画
 */
export const createAnimation = (
  element: HTMLElement,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options: AnimationOptions = {}
): Animation => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease-out',
    fillMode = 'both',
    iterationCount = 1
  } = options

  return element.animate(keyframes, {
    duration,
    delay,
    easing,
    fill: fillMode,
    iterations: iterationCount || 1
  })
}

/**
 * 淡入动画
 */
export const fadeIn = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { opacity: 0 },
      { opacity: 1 }
    ],
    { duration: 300, ...options }
  )
}

/**
 * 淡出动画
 */
export const fadeOut = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    { duration: 300, ...options }
  )
}

/**
 * 从下方淡入
 */
export const fadeInUp = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    { duration: 500, ...options }
  )
}

/**
 * 从上方淡入
 */
export const fadeInDown = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { opacity: 0, transform: 'translateY(-20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    { duration: 500, ...options }
  )
}

/**
 * 缩放进入
 */
export const scaleIn = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { opacity: 0, transform: 'scale(0.9)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    { duration: 300, easing: 'cubic-bezier(0, 0, 0.2, 1)', ...options }
  )
}

/**
 * 缩放退出
 */
export const scaleOut = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.9)' }
    ],
    { duration: 300, easing: 'cubic-bezier(0.4, 0, 1, 1)', ...options }
  )
}

/**
 * 滑入（从左）
 */
export const slideInLeft = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { transform: 'translateX(-100%)' },
      { transform: 'translateX(0)' }
    ],
    { duration: 300, ...options }
  )
}

/**
 * 滑入（从右）
 */
export const slideInRight = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { transform: 'translateX(100%)' },
      { transform: 'translateX(0)' }
    ],
    { duration: 300, ...options }
  )
}

/**
 * 弹性进入
 */
export const elasticIn = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { opacity: 0, transform: 'scale(0.3)' },
      { opacity: 1, transform: 'scale(1.05)' },
      { transform: 'scale(0.9)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    { duration: 600, easing: 'ease-out', ...options }
  )
}

/**
 * 摇摆动画
 */
export const shake = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ],
    { duration: 500, ...options }
  )
}

/**
 * 脉冲动画
 */
export const pulse = (
  element: HTMLElement,
  options: AnimationOptions = {}
): Animation => {
  return createAnimation(
    element,
    [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0.8, transform: 'scale(1.05)' },
      { opacity: 1, transform: 'scale(1)' }
    ],
    { duration: 2000, iterationCount: 'infinite', ...options }
  )
}

/**
 * 添加CSS类动画
 */
export const addAnimationClass = (
  element: HTMLElement,
  className: string,
  duration?: number
): Promise<void> => {
  return new Promise((resolve) => {
    element.classList.add(className)
    
    const handleAnimationEnd = () => {
      element.classList.remove(className)
      element.removeEventListener('animationend', handleAnimationEnd)
      resolve()
    }
    
    element.addEventListener('animationend', handleAnimationEnd)
    
    // 如果指定了持续时间，使用setTimeout作为后备
    if (duration) {
      setTimeout(() => {
        element.classList.remove(className)
        element.removeEventListener('animationend', handleAnimationEnd)
        resolve()
      }, duration)
    }
  })
}

/**
 * 序列动画
 */
export const sequenceAnimations = async (
  animations: (() => Promise<void> | Animation)[]
): Promise<void> => {
  for (const animationFn of animations) {
    const result = animationFn()
    if (result instanceof Promise) {
      await result
    } else if (result && 'finished' in result) {
      await result.finished
    }
  }
}

/**
 * 并行动画
 */
export const parallelAnimations = async (
  animations: (() => Promise<void> | Animation)[]
): Promise<void> => {
  const promises = animations.map(animationFn => {
    const result = animationFn()
    if (result instanceof Promise) {
      return result
    } else if (result && 'finished' in result) {
      return result.finished
    }
    return Promise.resolve()
  })
  
  await Promise.all(promises)
}

/**
 * 交错动画
 */
export const staggerAnimations = async (
  elements: HTMLElement[],
  animationFn: (element: HTMLElement, index: number) => Animation | Promise<void>,
  staggerDelay: number = 100
): Promise<void> => {
  const promises = elements.map((element, index) => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const result = animationFn(element, index)
        if (result instanceof Promise) {
          await result
        } else if (result && 'finished' in result) {
          await result.finished
        }
        resolve()
      }, index * staggerDelay)
    })
  })
  
  await Promise.all(promises)
}

/**
 * 检查是否支持减少动画
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 安全的动画执行（考虑用户偏好）
 */
export const safeAnimate = async (
  animationFn: () => Animation | Promise<void>,
  fallbackFn?: () => void
): Promise<void> => {
  if (prefersReducedMotion()) {
    if (fallbackFn) {
      fallbackFn()
    }
    return Promise.resolve()
  }
  
  const result = animationFn()
  if (result instanceof Promise) {
    return result
  } else if (result && 'finished' in result) {
    await result.finished
  }
}

/**
 * 创建过渡效果
 */
export const createTransition = (
  element: HTMLElement,
  properties: Record<string, string>,
  options: TransitionOptions = {}
): void => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease-out',
    property = 'all'
  } = options

  element.style.transition = `${property} ${duration}ms ${easing} ${delay}ms`
  
  // 应用新的样式
  Object.assign(element.style, properties)
}

/**
 * 动画队列管理器
 */
export class AnimationQueue {
  private queue: (() => Promise<void>)[] = []
  private isRunning = false

  add(animationFn: () => Promise<void>): void {
    this.queue.push(animationFn)
    if (!this.isRunning) {
      this.run()
    }
  }

  private async run(): Promise<void> {
    this.isRunning = true
    
    while (this.queue.length > 0) {
      const animationFn = this.queue.shift()
      if (animationFn) {
        await animationFn()
      }
    }
    
    this.isRunning = false
  }

  clear(): void {
    this.queue = []
  }

  get length(): number {
    return this.queue.length
  }
}

// 全局动画队列实例
export const globalAnimationQueue = new AnimationQueue()