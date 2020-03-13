import { useEffect, useState } from "react";
import axios from "axios";

const useApi = initialUrl => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(!!initialUrl);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (url) {
      setLoading(true);
      setError(null);

      axios
        .get(url)
        .then(res => {
          setData(res.data);
        })
        .catch(err => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [url]);

  return [data, loading, error, setUrl];
};

export default useApi;
