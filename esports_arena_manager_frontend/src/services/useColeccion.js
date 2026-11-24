import { useEffect, useState } from 'react';

export function useColeccion(load) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    load().then(result => {
      if (active) setItems(result);
    }).catch(failure => {
      if (active) setError(failure.message);
    });
    return () => { active = false; };
  }, [load, revision]);

  function reload() {
    setItems(null);
    setError('');
    setRevision(value => value + 1);
  }

  return { items, error, reload };
}
