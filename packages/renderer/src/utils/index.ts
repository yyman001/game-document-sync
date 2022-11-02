import { inject, InjectionKey } from 'vue'

import { isObject } from '@/utils/is'
import { join } from 'path'

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams (baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

export function deepMerge<T = any> (src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

export const getPath = (...params: any) => {
  return join(...params)
}

export const getAppPath = (...params: any) => {
  return getPath(window.APP_HOME_DIR, ...params)
}

export const getDefaultBackupPath = (...params: any) => {
  return getPath(window.APP_HOME_DIR, 'backup', ...params)
}

export const getDefaultTempPath = (...params: any) => {
  return getPath(window.APP_HOME_DIR, 'temp', ...params)
}

export function injectStrict<T> (key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback)
  if (!resolved) {
    throw new Error(`Could not resolve ${key.description}`)
  }
  return resolved
}
