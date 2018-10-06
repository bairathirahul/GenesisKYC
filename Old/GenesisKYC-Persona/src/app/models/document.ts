export class Document {
  static documentTypes = ['SSN Card', 'Passport', 'Driving Licence', 'Employment Proof', 'Account Statement', 'Other Document'];

  id: number;
  documentType: string;
  documentID: number;
  documentName: string;
  documentDesc: string;
  deleted = false;
  open = false;

  static convert(input: any) {
    const documents = Array<Document>();
    if (input != null) {
      const inputArray = [];
      for (let key in input) {
        if (input.hasOwnProperty(key)) {
          inputArray.push(input[key]);
        }
      }

      if (inputArray.length > 0) {
        for (const entry of inputArray) {
          const document = new Document();
          document.documentType = entry.DocumentType;
          document.documentID = entry.DocumentID;
          document.documentDesc = entry.DocumentDesc;
          documents.push(document);
        }
      }
    }
    return documents;
  }
}
