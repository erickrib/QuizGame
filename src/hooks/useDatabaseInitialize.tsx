import { useEffect, useState } from 'react';
import { conn, initializeDatabase } from '../database/db';

/**
* Hook para inicializar e gerenciar o estado da conexão do banco de dados.
* Retorna um booleano indicando se o banco de dados está pronto.
*/
export function useDatabaseInitialize() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const dbReady = await initializeDatabase();
      setReady(dbReady);
    }

    init();

    // limpa e destrói a conexão do banco de dados na desmontagem do componente
    return () => {
      conn.destroy();
      setReady(false);
    };
  }, []);

  return { ready };
}