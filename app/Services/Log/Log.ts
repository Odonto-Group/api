import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';

class LogService {
  private baseLogDirectory: string;

  constructor() {
    
    this.baseLogDirectory = path.join(__dirname, '..', '..', '..', 'logs');

    if (!fs.existsSync(this.baseLogDirectory)) {
      fs.mkdirSync(this.baseLogDirectory, { recursive: true });
    }
  }

  private getLogFileName(id: string, tipoRequisicao: string): string {
    const timestamp = DateTime.now().toFormat('yyyyMMddHHmmssSSS');
    return `${timestamp}-${tipoRequisicao}-${id}.json`;
  }

  private getLogDirectory(tipoLog: string): string {
    let logDirectory = this.baseLogDirectory;

    if (tipoLog === 'erro') {
      logDirectory = path.join(this.baseLogDirectory, 'erros');
    } else if (tipoLog === 'saida') {
      logDirectory = path.join(this.baseLogDirectory, 'saidas');
    } else if (tipoLog === 'entrada') {
      logDirectory = path.join(this.baseLogDirectory, 'entradas');
    } else if (tipoLog === 'api') {
        logDirectory = path.join(this.baseLogDirectory, 'RetornosApi');
      }

    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }

    return logDirectory;
  }

  public writeLog(id: string, tipoRequisicao: string, data: any): void {
    const logDirectory = this.getLogDirectory(data.type);
    const fileName = this.getLogFileName(id, tipoRequisicao);
    const logPath = path.join(logDirectory, fileName);

    const logMessage = {
      timestamp: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      data: data.data,
    };

    const logMessageStr = JSON.stringify(logMessage);

    fs.appendFileSync(logPath, logMessageStr + '\n');
  }
}

export default LogService;
