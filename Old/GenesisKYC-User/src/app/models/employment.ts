export class Employment {
  static employmentTypes = ['Full Time', 'Part Time'];

  empID: number;
  employmentType: string;
  companyName: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  designation: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  grossSalary: number;
  deleted = false;
  open = false;

  static convert(input: any) {
    const employments = Array<Employment>();
    if (input != null) {
      const inputArray = [];
      for (let key in input) {
        if(input.hasOwnProperty(key)) {
          inputArray.push(input[key]);
        }
      }

      if (inputArray.length > 0) {
        for (const entry of inputArray) {
          const employment = new Employment();
          employment.empID = entry.EmpID;
          employment.employmentType = entry.EmploymentType;
          employment.companyName = entry.CompanyName;
          employment.street1 = entry.Street1;
          employment.street2 = entry.Street2;
          employment.city = entry.City;
          employment.state = entry.State;
          employment.country = entry.Country;
          employment.zip = entry.Zip;
          employment.designation = entry.Designation;
          employment.startDate = entry.StartDate > 0 ? new Date(entry.StartDate) : null;
          employment.endDate = entry.EndDate > 0 ? new Date(entry.EndDate) : null;
          employment.isCurrent = entry.IsCurrent;
          employment.grossSalary = entry.GrossSalary;
          employments.push(employment);
        }
      }
    }
    return employments;
  }
}
