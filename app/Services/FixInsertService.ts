import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { decryptData, encryptData } from 'App/utils/cryptoUtils';

class FixInsertService {
    private errorLogsPath = path.join(__dirname, '../../logs/individual/erros');
    private inputLogsPath = path.join(__dirname, '../../logs/individual/entradas');

    public async processErrorLogs(startDate: Date, endDate: Date) {

        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const errorFiles = fs.readdirSync(this.errorLogsPath);

        for (const file of errorFiles) {
            const filePath = path.join(this.errorLogsPath, file);
            const fileStat = fs.statSync(filePath);
            const fileDate = new Date(fileStat.mtime);
            console.log('fileDate: ', fileDate);

            const startTime = start.getTime();
            const endTime = end.getTime();
            const fileTime = fileDate.getTime();
            if (fileTime >= startTime && fileTime <= endTime) {
                const proposalNumber = this.extractProposalNumber(file);
                console.log('proposalNumber: ', proposalNumber);
                if (proposalNumber) {
                    const latestInputFile = this.findLatestInputFile(proposalNumber, start, end);
                    if (latestInputFile) {
                        const data = this.extractDataFromFile(latestInputFile);
                        await this.sendDataToApi(data.data);
                    }
                }
            }
        }
    }

    private extractProposalNumber(fileName: string): string | null {
        console.log('fileName: ', fileName);
        const match = fileName.match(/Pagamento-(\d+)\.json/);
        return match ? match[1] : null;
    }

    private findLatestInputFile(proposalNumber: string, startDate: Date, endDate: Date): string | null {
        const inputFiles = fs.readdirSync(this.inputLogsPath);
        const matchingFiles = inputFiles.filter(file => file.includes(proposalNumber));

        if (matchingFiles.length === 0) {
            console.log('não achou matchingFiles');
            return null;
        }

        const filteredFiles = matchingFiles.filter(file => {
            const filePath = path.join(this.inputLogsPath, file);
            const fileStat = fs.statSync(filePath);
            const fileDate = new Date(fileStat.mtime);
            return fileDate >= startDate && fileDate <= endDate;
        });

        if (filteredFiles.length === 0) {
            return null;
        }

        filteredFiles.sort((a, b) => {
            const aTime = fs.statSync(path.join(this.inputLogsPath, a)).mtime.getTime();
            const bTime = fs.statSync(path.join(this.inputLogsPath, b)).mtime.getTime();
            return bTime - aTime;
        });

        return path.join(this.inputLogsPath, filteredFiles[0]);
    }

    private extractDataFromFile(filePath: string): any {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }

    private async sendDataToApi(data: any) {
        try {
            const url = 'https://api.v2.odontogroup.com.br';
            const response = await axios.post(`${url}/payment/individual/plan`, data);
            console.log('Data sent successfully:', response.data);
            const resposta = response.data;
            return resposta;
        } catch (error) {
            console.error('Error sending data to API:', error);
        }
    }
}

export default FixInsertService;