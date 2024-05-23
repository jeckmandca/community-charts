import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const AuthenticationWrapper: React.FC<any>=({children}) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo ? appState.returnTo : window.location.pathname, {
      state: {
        metricData: appState.metricData,
        chartOptions: appState.chartOptions,
        saveChart: appState.saveChart
      }
    });
  };

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH_DOMAIN || ''}
      clientId={process.env.REACT_APP_AUTH_CLIENT_ID || ''}
      redirectUri={window.location.origin}
      prompt='select_account'
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens
      getIdTokenClaims
      cacheLocation="localstorage">
      {children}
    </Auth0Provider>
  );
};

export default AuthenticationWrapper;
