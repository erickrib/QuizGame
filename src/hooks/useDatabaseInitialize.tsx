import { useEffect, useState } from 'react';
import { conn } from '../database/db';

/**
* Hook para inicializar e gerenciar o estado da conexão do banco de dados.
* Retorna um booleano indicando se o banco de dados está pronto.
*/
export function useDatabaseInitialize() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        // Verifica se o banco de dados já está inicializado
        if (!conn.isInitialized) {
          // Inicializa a conexão do banco de dados
          await conn.initialize();
          console.warn ('Database connected!');
          setReady(true);
        }
      } catch (error) {
        console.error('Error on database initialize:', error);
        setReady(false);
      }
    }

    initializeDatabase();

    // limpa e destrói a conexão do banco de dados na desmontagem do componente
    return () => {
      conn.destroy();
      setReady(false);
    };
  }, []);

  return { ready };
}
