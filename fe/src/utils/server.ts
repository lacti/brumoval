let serverBaseUrl =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}://${window.location.host}`
    : `http://localhost:3001`;
(async () => {
  try {
    await fetch(serverBaseUrl).then(r => r.text());
  } catch (_) {
    serverBaseUrl = `http://localhost:3001`;
  }
})();

export const server = <T>(url: string, body: any) => {
  return fetch(`${serverBaseUrl}/api${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(r => (r.json() as any) as T)
    .catch(error => {
      window.console.warn(`Error in ${url} with ${JSON.stringify(body)}`);
      window.console.warn(error);
      throw error;
    });
};
