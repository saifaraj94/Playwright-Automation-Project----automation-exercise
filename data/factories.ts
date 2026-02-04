import { faker } from '@faker-js/faker';
import { User } from './types';

export const createRandomUser = (): User => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = faker.internet.password({ length: 10 });
    const company = faker.company.name();

    return {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(),
        password: password,
        title: faker.datatype.boolean() ? 'Mr' : 'Mrs',
        firstName: firstName,
        lastName: lastName,
        company: company,
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        country: 'United States', // Fixed list in the app usually
        state: faker.location.state(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        mobileNumber: faker.phone.number(),
        birthDay: faker.number.int({ min: 1, max: 28 }).toString(),
        birthMonth: faker.number.int({ min: 1, max: 12 }).toString(),
        birthYear: faker.number.int({ min: 1980, max: 2005 }).toString()
    };
};
