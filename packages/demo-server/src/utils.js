export const strip = (string, spaces) => {
  string = string.replace(/\n{1}/, '')
  const regex = new RegExp(`^.{${spaces}}`, 'gm')
  return string.replace(regex, '')
}
