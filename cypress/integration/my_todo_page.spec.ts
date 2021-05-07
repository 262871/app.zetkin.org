import { BookedEvent } from '../../src/types';
import { ZetkinEventResponse } from '../../src/types/zetkin';

describe('/my/todo', () => {
    let dummyEventResponses : {data: ZetkinEventResponse[]};
    let dummyBookedEvents : {data: BookedEvent[]};

    before(() => {
        cy.fixture('dummyEventResponses.json')
            .then((data : {data: ZetkinEventResponse[]}) => {
                dummyEventResponses = data;
            });
        cy.fixture('dummyBookedEvents.json')
            .then((data : {data: BookedEvent[]}) => {
                dummyBookedEvents = data;
            });
    });

    beforeEach(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    after(() => {
        cy.request('delete', 'http://localhost:8001/_mocks');
    });

    it('contains respond-events', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: dummyEventResponses,
            },
        });

        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]')
            .click();
        cy.visit('/my/todo');
        cy.waitUntilReactRendered();
        cy.get('a[href*="/o/1/events"]').should('have.length', 1);
    });

    it('contains booked events', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: dummyEventResponses,
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/actions/_mocks/get', {
            response: {
                data: dummyBookedEvents,
            },
        });

        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]')
            .click();

        cy.visit('/my/todo');
        cy.waitUntilReactRendered();
        cy.get('[data-testid="booked"]').should('have.length', 1);
    });

    it('contains a placeholder if there are neither call assignments nor respond-events', () => {
        cy.request('put', 'http://localhost:8001/v1/users/me/call_assignments/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.request('put', 'http://localhost:8001/v1/users/me/action_responses/_mocks/get', {
            response: {
                data: {
                    data: [],
                },
            },
        });

        cy.visit('/login');
        cy.get('input[aria-label="E-mail address"]').type('testadmin@example.com');
        cy.get('input[aria-label="Password"]').type('password');
        cy.get('input[aria-label="Log in"]')
            .click();

        cy.visit('/my/todo');
        cy.contains('You have nothing planned at the moment.');
    });
});

// Hack to flag for typescript as module
export {};
