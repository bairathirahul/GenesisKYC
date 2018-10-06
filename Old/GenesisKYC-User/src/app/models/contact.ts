export class Contact {
  static primaryContacts = ['Home Phone Number', 'Work Phone Number', 'Mobile Phone Number'];

  primaryContact: string;
  homeNumber: string;
  workNumber: string;
  mobileNumber: string;
  emailAddress: string;

  static convert(input: any) {
    const contact = new Contact();
    if (input != null) {
      contact.primaryContact = input.PrimaryContact;
      contact.homeNumber = input.HomeNumber;
      contact.workNumber = input.WorkNumber;
      contact.mobileNumber = input.MobileNumber;
      contact.emailAddress = input.EmailAddress;
    }
    return contact;
  }
}
