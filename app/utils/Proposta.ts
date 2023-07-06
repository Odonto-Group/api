import { DateTime } from "luxon";

export default function gerarNumeroProposta() {
    const now = DateTime.local();
    
    const year = now.toFormat('yyyy');
    const month = now.toFormat('MM');
    
    const timestamp = Math.floor(now.toMillis() / 1000);
    
    return `${year}${month}${timestamp}`;
  }