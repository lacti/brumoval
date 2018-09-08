let serverBaseUrl = `${window.location.protocol}://${window.location.hostname}`;
(async () => {
  try {
    await fetch(serverBaseUrl).then(r => r.text());
  } catch (_) {
    serverBaseUrl = `http://localhost:3001`;
  }
})();

export const server = <T>(url: string, body: any) => {
  return fetch(`${serverBaseUrl}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(r => (r.json() as any) as T);
};
