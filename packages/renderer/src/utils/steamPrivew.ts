// 中文版
export type CHINESE_LAN = 'schinese'

/**
 * Generates the URL for the horizontal cover image of a Steam game.
 *
 * @param {string | number} steamId - The ID of the Steam game.
 * @param {CHINESE_LAN} lan - The language of the cover image (optional).
 * @returns {string} - The URL of the horizontal cover image.
 */
export function horizontalCover(steamId: string | number, lan?: CHINESE_LAN): string {
  const baseUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamId}/header`
  const imageUrl = lan ? `${baseUrl}_${lan}.jpg?t=1445525035` : `${baseUrl}.jpg?t=1445525035`

  return steamId ? imageUrl : ''
}

/**
 * 垂直图 Generates the URL for the vertical cover image based on the steamId.
 *
 * @param {string | number} steamId - The steamId to generate the URL for.
 * @returns {string} The URL for the vertical cover image.
 */
export function verticalCover(steamId: string | number): string {
  if (!steamId) {
    return ''
  }

  const baseUrl = 'https://cdn.cloudflare.steamstatic.com/steam/apps/'
  const imageSize = 'library_600x900.jpg'
  const timestamp = '1445525035'

  return `${baseUrl}${steamId}/${imageSize}?t=${timestamp}`
}
