import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

   
    return () => unsubscribe();

  }, []);

  return isConnected;
};

export { useNetworkStatus };