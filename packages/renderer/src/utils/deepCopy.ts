function deepCopy<T extends unknown> (obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    // 如果 obj 是基本类型或 null，直接返回
    return obj
  }

  if (Array.isArray(obj)) {
    // 如果 obj 是数组，遍历并复制数组元素
    const copy: any[] = []
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepCopy(obj[i])
    }
    return copy as T
  }

  // 如果 obj 是对象，遍历并复制对象属性
  const copy: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy(obj[key])
    }
  }
  return copy as T
}

export { deepCopy }
