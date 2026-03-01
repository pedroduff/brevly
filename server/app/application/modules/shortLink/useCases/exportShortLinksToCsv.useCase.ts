import { randomUUID } from 'node:crypto';
import type { ShortLinkRepository } from '../../../../domain/repositories/shortLink.repository.js';

export interface CsvExportStorage {
  upload(content: string, filename: string): Promise<string>;
}

const CSV_HEADERS = 'URL original,URL encurtada,Contagem de acessos,Data de criação\n';

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export interface ExportShortLinksToCsvOutput {
  url: string;
}

export class ExportShortLinksToCsvUseCase {
  constructor(
    private readonly shortLinkRepository: ShortLinkRepository,
    private readonly csvStorage: CsvExportStorage,
  ) {}

  async execute(): Promise<ExportShortLinksToCsvOutput> {
    const content = await this.generateCsvContent();
    const filename = `export-${randomUUID()}.csv`;
    const url = await this.csvStorage.upload(content, filename);
    return { url };
  }

  async generateCsvContent(): Promise<string> {
    const rows: string[] = [CSV_HEADERS];
    let cursor: string | undefined;
    const limit = 500;
    do {
      const result = await this.shortLinkRepository.list({ limit, cursor });
      for (const item of result.items) {
        rows.push(
          [
            escapeCsvField(item.originalUrl.value),
            escapeCsvField(item.slug.value),
            String(item.accessCount),
            escapeCsvField(item.createdAt.toISOString()),
          ].join(',') + '\n',
        );
      }
      cursor = result.nextCursor ?? undefined;
    } while (cursor);
    return rows.join('');
  }
}
