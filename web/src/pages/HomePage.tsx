import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, type ShortLinkItem } from '../api/client';
import logoUrl from '../assets/logo.svg';

const formSchema = z.object({
  slug: z
    .string()
    .min(4, 'Mínimo 4 caracteres')
    .max(16, 'Máximo 16 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'Apenas letras e números'),
  originalUrl: z.string().url('URL inválida'),
});

type FormValues = z.infer<typeof formSchema>;

export function HomePage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery('links', () =>
    api.listLinks({ limit: 100 }),
  );

  const createMutation = useMutation(api.createLink, {
    onSuccess: () => queryClient.invalidateQueries('links'),
  });

  const deleteMutation = useMutation((id: string) => api.deleteLink(id), {
    onSuccess: () => queryClient.invalidateQueries('links'),
  });

  const [exportError, setExportError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportDownload = async () => {
    setExportError(null);
    setExportLoading(true);
    try {
      const { url } = await api.exportCsv();
      window.open(url, '_blank');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setExportError(msg);
    } finally {
      setExportLoading(false);
    }
  };

  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { slug: '', originalUrl: '' },
  });

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    createMutation.mutate(values, {
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('already exists'))
          setError('slug', { message: 'Este encurtamento já existe' });
        else if (msg.includes('Invalid slug'))
          setError('slug', { message: 'Formato de encurtamento inválido' });
        else setSubmitError(msg);
      },
      onSuccess: () => reset(),
    });
  };

  const copyRedirectUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="min-h-screen bg-brevly-gray home-page" style={{ backgroundColor: '#E4E6EC' }}>
      <header className="home-header">
        <Link to="/" className="inline-block">
          <img src={logoUrl} alt="Brevly" className="h-10 w-auto" />
        </Link>
      </header>

      {/* Dois cards lado a lado, centralizados */}
      <div className="home-cards">
        {/* Card Novo link — branco, à esquerda */}
        <div className="home-cards-card-form rounded-lg bg-brevly-card shadow-md" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="home-form-card"
          >
            <h1 className="home-form-title">Novo link</h1>
            <div className="home-form-fields">
              <div className="home-form-field">
                <label htmlFor="originalUrl" className="home-form-label">
                  URL original
                </label>
                <input
                  {...register('originalUrl')}
                  id="originalUrl"
                  type="url"
                  placeholder="https://exemplo.com/pagina"
                  className="home-form-input"
                />
                {errors.originalUrl && (
                  <p className="text-sm text-red-600">
                    {errors.originalUrl.message}
                  </p>
                )}
              </div>
              <div className="home-form-field">
                <label htmlFor="slug" className="home-form-label">
                  Encurtamento
                </label>
                <input
                  {...register('slug')}
                  id="slug"
                  type="text"
                  placeholder="meulink"
                  className="home-form-input"
                />
                {errors.slug && (
                  <p className="text-sm text-red-600">{errors.slug.message}</p>
                )}
              </div>
              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="home-form-submit"
              >
                {createMutation.isLoading ? 'Criando...' : 'Encurtar'}
              </button>
            </div>
          </form>
        </div>

        {/* Card Meus links — padrão meuslinks.svg */}
        <div className="home-cards-card-list rounded-lg bg-brevly-card shadow-md" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
          <header className="meuslinks-header">
            <h2 className="meuslinks-title">Meus links</h2>
            <button
              type="button"
              onClick={handleExportDownload}
              disabled={exportLoading}
              className="meuslinks-export-btn"
            >
              {exportLoading ? 'Exportando...' : 'Exportar CSV'}
            </button>
          </header>
          <hr className="meuslinks-divider" />

          {exportError && (
            <p className="meuslinks-loading" style={{ color: 'var(--red-600, #b91c1c)' }}>
              {exportError}
            </p>
          )}
          {isLoading && (
            <p className="meuslinks-loading">Carregando...</p>
          )}
          {error ? (
            <p className="meuslinks-loading" style={{ color: 'var(--red-600, #b91c1c)' }}>
              Erro ao carregar links. Tente novamente.
            </p>
          ) : null}
          {data && data.items.length === 0 && !isLoading && (
            <p className="meuslinks-empty">Nenhum link cadastrado. Crie um acima.</p>
          )}
          {data && data.items.length > 0 && (
            <ul className="meuslinks-list">
              {data.items.map((item) => (
                <LinkRow
                  key={item.id}
                  item={item}
                  onCopy={copyRedirectUrl}
                  onDelete={() => deleteMutation.mutate(item.id)}
                  isDeleting={deleteMutation.isLoading}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function LinkRow({
  item,
  onCopy,
  onDelete,
  isDeleting,
}: {
  item: ShortLinkItem;
  onCopy: (url: string) => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const shortUrl = item.redirectUrl;
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    if (!showConfirm) {
      setShowConfirm(true);
    } else {
      onDelete();
    }
  };

  return (
    <li className="meuslinks-row">
      <div className="meuslinks-row-content">
        <p className="meuslinks-row-url-original">{item.originalUrl}</p>
        <p className="meuslinks-row-url-short">{shortUrl}</p>
        <p className="meuslinks-row-meta">
          {item.accessCount} acessos · {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <div className="meuslinks-row-actions">
        <button
          type="button"
          onClick={() => onCopy(item.redirectUrl)}
          className="meuslinks-icon-btn"
          title="Copiar link"
        >
          Copiar
        </button>
        {!showConfirm ? (
          <button
            type="button"
            onClick={handleDelete}
            className="meuslinks-icon-btn danger"
            title="Excluir"
          >
            Excluir
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onDelete()}
              disabled={isDeleting}
              className="meuslinks-icon-btn danger"
              title="Confirmar exclusão"
            >
              {isDeleting ? '…' : 'Ok'}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="meuslinks-icon-btn"
              title="Cancelar"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </li>
  );
}
