/**
 * 横图
 *
 * @param {String|Number} steamId
 * @returns
 */
export function horizontalCover(steamId: string | number): string {
  if (!steamId) return ''
  // eg: https://media.st.dl.pinyuncloud.com/steam/apps/588650/extras/Header2.jpg?t=1613038574
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamId}/header.jpg?t=1445525035`
}
/**
 * 垂直图
 *
 * @param {String|Number} steamId
 * @returns
 */
export function verticalCover(steamId: string | number): string {
  if (!steamId) return ''
  // eg https://cdn.cloudflare.steamstatic.com/steam/apps/413150/library_600x900.jpg?t=1560535131
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamId}/library_600x900.jpg?t=1560535131`
}
