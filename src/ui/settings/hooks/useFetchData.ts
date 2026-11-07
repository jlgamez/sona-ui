import { useEffect, useState } from "react";

/** Fetches data on mount and on `reload`. `data` is null until loaded, and stays null if the request fails. */
export function useFetchData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    fetcher()
      .then((result) => isCurrent && setData(result))
      .catch(() => isCurrent && setData(null));
    return () => {
      isCurrent = false;
    };
  }, [fetcher, version]);

  return { data, reload: () => setVersion((current) => current + 1) };
}
