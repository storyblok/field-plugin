const sandboxBaseUrl = `https://storyblok-field-plugin-sandbox.vercel.app/`
export const sandboxUrl = () => {
  const sandboxQuery = new URLSearchParams({
    url: window.location.href,
  }).toString()
  return `${sandboxBaseUrl}?${sandboxQuery}`
}
