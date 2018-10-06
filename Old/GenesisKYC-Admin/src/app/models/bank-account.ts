export class BankAccount {
  static accountTypes = ['Savings', 'Checkings', 'Loan'];
  accID: number;
  accountType: string;
  bankName: string;
  accountNo: string;
  routingNo: string;
  deleted = false;
  open = false;

  static convert(input: any) {
    const bankAccounts = Array<BankAccount>();
    if (input != null) {
      const inputArray = [];
      for (let key in input) {
        if(input.hasOwnProperty(key)) {
          inputArray.push(input[key]);
        }
      }

      if (inputArray.length > 0) {
        for (const entry of inputArray) {
          const bankAccount = new BankAccount();
          bankAccount.accID = entry.AccID;
          bankAccount.accountType = entry.AccountType;
          bankAccount.bankName = entry.BankName;
          bankAccount.accountNo = entry.AccountNo;
          bankAccount.routingNo = entry.RoutingNo;
          bankAccounts.push(bankAccount);
        }
      }
    }
    return bankAccounts;
  }
}
