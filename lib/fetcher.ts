export function Fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}
