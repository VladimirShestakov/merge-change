import { diff } from '../index';
import { plain } from '../../plain';
import mc from '../../merge';

describe('Test diff()', () => {
  class Custom {
    protected value: any;

    constructor(value = {}) {
      this.value = value;
    }

    toJSON() {
      return this.value;
    }
  }

  test('common', () => {
    const first = {
      name: 1,
      profile: {
        surname: 'x',
        avatar: {
          code: 1,
          url: 'xxx',
          list: [{ a: 0 }, 1, null],
          i18n: new Custom({ x: undefined, ru: 'RU', en: 'EN' }),
        },
      },
      date: new Date('2021-01-26T23:41:59.433Z'),
      parent: { _id: 'null' },
      i18n: new Custom({ ru: 'RU', en: 'EN' }),
      some: 1,
      someDeep: {
        deep: {
          superdeep: [200],
        },
      },
    };

    const second = {
      name: 2,
      profile: {
        surname2: 'x',
        avatar: {
          code: 1,
          url: 'xxx',
          list: [0, 1, 2],
          i18n: new Custom({ x: undefined, ru: 'GB', en: 'EN' }),
        },
      },
      date: new Date('2021-01-26T23:41:59.433Z'),
      parent: { _id: 'null' },
      i18n: new Custom({ ru: 'RU', en: 'EN' }),
      newV: {
        some: {
          dd: 100,
          x: {
            gg: 200,
          },
        },
      },
    };

    const diffValue = diff(first, second, {});

    expect(plain(diffValue)).toEqual({
      $set: {
        name: 2,
        'profile.surname2': 'x',
        'profile.avatar.list': [0, 1, 2],
        'profile.avatar.i18n.ru': 'GB',
        date: '2021-01-26T23:41:59.433Z',
        newV: {
          some: {
            dd: 100,
            x: {
              gg: 200,
            },
          },
        },
      },
      $unset: ['profile.surname', 'some', 'someDeep'],
    });

    // Merge first object with diff
    const updated = mc.merge(plain(first), diffValue);

    expect(plain(updated)).toEqual(plain(second));
  });

  test('with ignore', () => {
    const first = {
      name: 1,
      profile: {
        surname: 'x',
        avatar: {
          code: 1,
        },
      },
      someDeep: {
        deep: {
          superdeep: [200],
        },
      },
    };

    const second = {
      name: 2,
      profile: {
        newSurname: 'x',
        avatar: {
          code: 1,
          url: 'xxx',
        },
      },
    };

    const diffValue = diff(first, second, { ignore: ['someDeep', 'profile.avatar.url'] });

    expect(plain(diffValue)).toEqual({
      $set: {
        name: 2,
        'profile.newSurname': 'x',
        //"profile.avatar.url": "xxx"
      },
      $unset: [
        'profile.surname',
        //"someDeep"
      ],
    });
  });

  test('with white', () => {
    const first = {
      name: 1,
      profile: {
        surname: 'x',
        avatar: {
          code: 1,
        },
      },
      someDeep: {
        deep: {
          superdeep: [200],
        },
      },
    };

    const second = {
      name: 2,
      profile: {
        newSurname: 'x',
        avatar: {
          code: 1,
          url: 'xxx',
        },
      },
    };

    const diffValue = diff(first, second, {
      white: ['name', 'profile', 'profile.newSurname', 'profile.surname'],
    });

    console.log(diffValue);

    expect(plain(diffValue)).toEqual({
      $set: {
        name: 2,
        'profile.newSurname': 'x',
        //"profile.avatar.url": "xxx"
      },
      $unset: [
        'profile.surname',
        //"someDeep"
      ],
    });
  });

  test('simple', () => {
    const first = {
      name: 'value',
      profile: {
        surname: 'Surname',
        birthday: new Date(),
        avatar: {
          url: 'pic.png',
        },
      },
      access: [100, 350, 200],
    };

    const second = {
      login: 'value',
      profile: {
        surname: 'Surname2',
        avatar: {
          url: 'new/pic.png',
        },
      },
      access: [700],
    };

    const diffValue = diff(first, second, {});

    expect(diffValue).toEqual({
      $set: {
        login: 'value',
        'profile.surname': 'Surname2',
        'profile.avatar.url': 'new/pic.png',
        access: [700],
      },
      $unset: ['profile.birthday', 'name'],
    });
  });

  test('custom compare', () => {
    const first = {
      number: '10',
      text: '10',
      double: 0.3,
      double2: 12.12345,
    };

    const second = {
      number: 10,
      text: 'ten',
      double: 0.1 + 0.2,
      double2: 12.12346,
    };

    const diffValue = diff(first, second, {
      equal: (first: any, second: any) => {
        if (first === second) return true;
        first = Number(first);
        second = Number(second);
        if (first !== null && second !== null) {
          return first === second || Math.abs(first - second) < Number.EPSILON;
        }
        return false;
      },
    });

    expect(diffValue).toEqual({
      $set: {
        double2: 12.12346,
        text: 'ten',
      },
      $unset: [],
    });
  });
});
