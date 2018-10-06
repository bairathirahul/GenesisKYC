export class BasicInfo {
  static salutations = ['Mr.', 'Ms.', 'Mrs.'];
  static genders = ['Male', 'Female', 'Unidentified'];
  static types = ['Person', 'Capital'];

  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: Date;
  gender: string;
  ssn: string;
  passport: string;
  type: string;

  static convert(input: any) {
    const basicInfo = new BasicInfo();
    if (input != null) {
      basicInfo.salutation = input.Salutation;
      basicInfo.firstName = input.FirstName;
      basicInfo.middleName = input.MiddleName;
      basicInfo.lastName = input.LastName;
      basicInfo.suffix = input.Suffix;
      basicInfo.dateOfBirth = input.DateOfBirth > 0 ? new Date(input.DateOfBirth) : null;
      basicInfo.gender = input.Gender;
      basicInfo.ssn = input.SSN;
      basicInfo.passport = input.Passport;
      basicInfo.type = input.Type;
    }
    return basicInfo;
  }
}
