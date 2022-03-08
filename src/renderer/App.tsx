import React, { useEffect, useState } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Home = () => {
  const [tunnel, setTunnel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-tunnel', ({ response }) => {
      setIsLoading(false);
      setTunnel(response.tunnel);

      if (!response.tunnel.closed) {
        axios.post('https://api.payjude.com/tunnel', {
          url: response.tunnel.url,
          clientId,
        });
      }
    });
  }, [clientId]);

  const onTunnelStartClick = async () => {
    setIsLoading(true);
    window.electron.ipcRenderer.startTunnel(clientId);
  };

  const onTunnelStopClick = async () => {
    setIsLoading(true);
    window.electron.ipcRenderer.stopTunnel();
  };

  const onCopyClick = (text) => {
    window.electron.ipcRenderer.saveToClipboard(text);
  };

  return (
    <div>
      <h1>Pronto tunnel</h1>

      {tunnel && (
        <div>
          <div className="row">
            <span className="label">Client ID:</span>
            <span className="value">{clientId}</span>
          </div>
          {tunnel.url && (
            <div className="row">
              <span className="label">URL:</span>
              <span className="value">{tunnel.url}</span>
              <button
                type="button"
                className="copy"
                onClick={() => onCopyClick(tunnel.url)}
              >
                📋
              </button>
            </div>
          )}
          <div className="row">
            <span className="label">Status:</span>
            <span className="value">
              {tunnel.closed ? (
                <span className="danger">closed</span>
              ) : (
                <span className="success">running</span>
              )}
            </span>
          </div>
        </div>
      )}

      <div className="wrapper">
        {tunnel ? (
          <>
            {tunnel.closed ? (
              <button
                type="button"
                onClick={onTunnelStartClick}
                disabled={isLoading}
              >
                🔄 Restart tunnelling
              </button>
            ) : (
              <button
                type="button"
                onClick={onTunnelStopClick}
                disabled={isLoading}
              >
                🛑 Stop tunnelling
              </button>
            )}
          </>
        ) : (
          <div className="startForm">
            <input
              placeholder="CLIENT_ID *"
              onChange={(e) => setClientId(e.target.value)}
            />
            <button
              type="button"
              onClick={onTunnelStartClick}
              disabled={isLoading || !clientId}
            >
              🚀 Start tunnelling
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}
