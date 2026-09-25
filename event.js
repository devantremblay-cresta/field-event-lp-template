// Event content — edit this file for each new field event.
// Photos: drop files in assets/photos/ and set `photo: 'assets/photos/jane-doe.jpg'`.
// Leave `photo` empty to show the grey placeholder.
window.EVENT = {
  pageTitle: 'Dinner for CX Leaders — Cresta',
  headerMeta: 'September 15th / New York',
  title: 'Dinner for CX Leaders',

  details: [
    { label: 'When', lines: ['Tuesday, September 15', '6:30 – 9:30 PM'] },
    {
      label: 'Where',
      lines: ['Venue name'],
      link: { text: '123 Street Name, New York', href: 'https://maps.google.com' },
    },
    {
      label: 'The evening',
      lines: ['Drinks at 6:30, dinner at 7:15, and an off-the-record conversation on AI in the contact center.'],
    },
  ],

  showHosts: true,
  hostsLabel: 'Your hosts from Cresta',
  hosts: [
    { name: 'Host Name', title: 'Title, Cresta', photo: '' },
    { name: 'Host Name', title: 'Title, Cresta', photo: '' },
    { name: 'Host Name', title: 'Title, Cresta', photo: '' },
  ],

  guestsHeading: "Who's joining us",
  guests: [
    { name: 'Guest Name', title: 'VP, Customer Experience', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'Head of Contact Center Operations', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'SVP, Customer Care', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'Director of Support', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'Chief Customer Officer', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'VP, Member Services', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'Head of CX Strategy', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'VP, Customer Operations', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'Director, Workforce Management', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'VP, Digital Experience', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'Head of Quality Assurance', company: 'Company', photo: '' },
    { name: 'Guest Name', title: 'SVP, Customer Success', company: 'Company', photo: '' },
  ],

  contactEmail: 'events@cresta.ai',
};
