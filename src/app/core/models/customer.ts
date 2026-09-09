export interface Customer {
  custId: number;
  name: string;
  mobileNo: string;
}

export interface RegisterCustomerRequest {
  CustId: number;
  Name: string;
  MobileNo: string;
  Password: string;
}

export interface LoginRequest {
  UserName: string;
  UserPassword: string;
}

export interface LoginCustomerDto {
  custId: number;
  name: string;
  mobileNo: string;
  password: string;
}