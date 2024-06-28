import { useEffect, useState } from 'react';
import { conn } from '../database/db';

export function useDatabaseInitialize() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        if (!conn.isInitialized) {
          await conn.initialize();
          console.log('Database connected!');
          setReady(true);
        }
      } catch (error) {
        console.error('Error on database initialize:', error);
        setReady(false);
      }
    }

    initializeDatabase();

    return () => {
      conn.destroy();
      setReady(false);
    };
  }, []);

  return { ready };
}
