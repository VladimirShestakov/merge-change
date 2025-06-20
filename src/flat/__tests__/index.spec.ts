import { flat } from '../index';
import { plain } from '../../plain';

describe('Test flat()', () => {
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
    const sets = flat({
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
    });

    expect(plain(sets)).toEqual({
      name: 1,
      'profile.surname': 'x',
      'profile.avatar.code': 1,
      'profile.avatar.url': 'xxx',
      'profile.avatar.list': [{ a: 0 }, 1, null],
      'profile.avatar.i18n.en': 'EN',
      'profile.avatar.i18n.ru': 'RU',
      date: '2021-01-26T23:41:59.433Z',
      'parent._id': 'null',
      'i18n.en': 'EN',
      'i18n.ru': 'RU',
    });
  });
});
