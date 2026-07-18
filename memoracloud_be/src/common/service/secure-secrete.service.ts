import * as fs from 'fs-extra';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { aliasToFileMap } from '../constants/authentication.constant';

@Injectable()
export class SecureSecretsService {
  private readonly logger = new Logger(SecureSecretsService.name);
  private readonly aliasToFileMap = aliasToFileMap;

//   private readonly secretsDir =
//     process.env.NODE_ENV === 'LOCAL'
//       ? path.resolve(__dirname, '../../src/share/mnt/secrets') // For local development
//       : '/mnt/secrets'; // For production/cloud

private readonly secretsDir =
  process.env.NODE_ENV === 'LOCAL'
    ? path.join(process.cwd(), 'keys')
    : path.join(process.cwd(), 'keys');


  private readonly allowedKeys = new Set(Object.values(this.aliasToFileMap));

  async getSecret(key: string): Promise<any> {
    const keyData = key.trim();
    const trimmedKey = this.aliasToFileMap[keyData];

    if (!trimmedKey || !this.allowedKeys.has(trimmedKey)) {
      const message = `Access to secret '${keyData}' is not allowed.`;
      this.logger.error(message);
      return { status: false, statusCode: 403, message };
    }

    try {
      const files = await fs.readdir(this.secretsDir);
      const matchedFile = files.find(
        (file) => path.parse(file).name === trimmedKey,
      );

      if (!matchedFile) {
        const message = `Secret file for key '${trimmedKey}' not found.`;
        this.logger.error(message);
        return { status: false, statusCode: 404, message };
      }

      const filePath = path.join(this.secretsDir, matchedFile);
      const content = await fs.readFile(filePath, 'utf-8');

      return { status: true, content };
    } catch (error) {
      const message = `Failed to read secret file '${trimmedKey}': ${error}`;
      this.logger.error(message);
      return { status: false, statusCode: 500, message };
    }
  }
}
