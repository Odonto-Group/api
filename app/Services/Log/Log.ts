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

  private getLogDirectory(tipoLog: string, local: string): string {
    let logDirectory = this.baseLogDirectory;
    if (local === 'individual'){
      if (tipoLog === 'erro') {
        logDirectory = path.join(this.baseLogDirectory, 'individual', 'erros');
      } else if (tipoLog === 'saida') {
        logDirectory = path.join(this.baseLogDirectory, 'individual', 'saidas');
      } else if (tipoLog === 'entrada') {
        logDirectory = path.join(this.baseLogDirectory, 'individual', 'entradas');
      } else if (tipoLog === 'api') {
          logDirectory = path.join(this.baseLogDirectory, 'individual', 'RetornosApi');
        }
    } else if (local === 'empresarial') {
      if (tipoLog === 'erro') {
        logDirectory = path.join(this.baseLogDirectory, 'PME', 'erros');
      } else if (tipoLog === 'saida') {
        logDirectory = path.join(this.baseLogDirectory, 'PME', 'saidas');
      } else if (tipoLog === 'entrada') {
        logDirectory = path.join(this.baseLogDirectory, 'PME', 'entradas');
      } else if (tipoLog === 'api') {
          logDirectory = path.join(this.baseLogDirectory, 'PME', 'RetornosApi');
        }
    }
    

    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }

    return logDirectory;
  }

  public writeLog(id: string, tipoRequisicao: string, data: any): void {
    const logDirectory = this.getLogDirectory(data.type, data.local);
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
