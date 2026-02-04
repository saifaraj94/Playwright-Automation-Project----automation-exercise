export interface User {
    name: string;
    email: string;
    password: string;
    title: 'Mr' | 'Mrs';
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
    birthDay: string;
    birthMonth: string;
    birthYear: string;
}

export interface AccountCreatedResponse {
    responseCode: number;
    message: string;
}
