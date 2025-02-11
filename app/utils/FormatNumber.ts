export default function formatNumberBrValue(value: number) {
    let formatting_options = {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      }
  
    let brazilString = new Intl.NumberFormat( 'pt-br', formatting_options );
    console.log(brazilString.format(value));
    return brazilString.format(value)
}