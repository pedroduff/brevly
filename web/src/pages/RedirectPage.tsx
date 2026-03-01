import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import logoUrl from '../assets/logo.svg';
import notFound404Url from '../assets/not-found-404.svg';

export function RedirectPage() {
  const { encurtador } = useParams<{ encurtador: string }>();
  const [status, setStatus] = useState<'loading' | 'not-found'>(() =>
    !encurtador ? 'not-found' : 'loading'
  );

  useEffect(() => {
    if (!encurtador) {
      setStatus('not-found');
      return;
    }
    setStatus('loading');
    api
      .getBySlug(encurtador)
      .then(() => {
        window.location.href = api.getRedirectUrl(encurtador);
      })
      .catch(() => {
        setStatus('not-found');
      });
  }, [encurtador]);

  const layout = (
    <div className="min-h-screen home-page" style={{ backgroundColor: '#E4E6EC' }}>
      <header className="home-header">
        <Link to="/" className="inline-block">
          <img src={logoUrl} alt="Brevly" className="h-10 w-auto" />
        </Link>
      </header>

      <div className="page404-wrapper">
        {status === 'loading' && (
          <div className="redirect-card">
            <h1 className="redirect-title">Redirecionando...</h1>
            <div className="redirect-spinner" aria-hidden />
            <p className="page404-text" style={{ margin: 0 }}>
              Você será redirecionado em instantes.
            </p>
          </div>
        )}
        {status === 'not-found' && (
          <div className="page404-card">
            <img
              src={notFound404Url}
              alt=""
              className="page404-illustration"
              aria-hidden
            />
            <h1 className="page404-title">Página não encontrada</h1>
            <p className="page404-text">
              O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em{' '}
              <Link to="/" className="page404-link">
                brev.ly
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return layout;
}
