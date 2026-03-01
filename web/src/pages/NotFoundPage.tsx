import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.svg';
import notFound404Url from '../assets/not-found-404.svg';

export function NotFoundPage() {
  return (
    <div className="min-h-screen home-page" style={{ backgroundColor: '#E4E6EC' }}>
      <header className="home-header">
        <Link to="/" className="inline-block">
          <img src={logoUrl} alt="Brevly" className="h-10 w-auto" />
        </Link>
      </header>

      <div className="page404-wrapper">
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
      </div>
    </div>
  );
}
