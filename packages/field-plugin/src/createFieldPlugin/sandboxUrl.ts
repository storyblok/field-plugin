const sandboxBaseUrl = `https://plugin-sandbox.storyblok.com/field-plugin/`
export const sandboxUrl = () => {
  const sandboxQuery = new URLSearchParams({
    url: window.location.href,
  }).toString()
  return `${sandboxBaseUrl}?${sandboxQuery}`
}
