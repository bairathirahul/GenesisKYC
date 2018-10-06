export class BankTransaction {
  static transactionTypes = ['Credit', 'Debit'];

  transactionID: string;
  transactionDate: Date;
  transactionType: string;
  description: string;
  amount: number;
  flagged: boolean;

  static convert(input: any) {
    const bankTransactions = Array<BankTransaction>();
    if (input != null && input.length > 0) {
      for (const entry of input) {
        const bankTransaction = new BankTransaction();
        bankTransaction.transactionID = entry.TransactionID;
        bankTransaction.transactionDate = new Date(entry.TransactionDate);
        bankTransaction.transactionType = entry.TransactionType;
        bankTransaction.description = entry.Descripton;
        bankTransaction.amount = entry.Amount;
        bankTransaction.flagged = entry.flagged;
        bankTransactions.push(bankTransaction);
      }
    }
    return bankTransactions;
  }
}
