const mc = require('../index.js');
const utils = mc.utils;

class Custom {
  constructor(value = {}) {
    this.value = value;
  }

  [utils.toFlatMethod](path = '', separator = '.', clearUndefined = false, result = {}) {
    for (const [key, text] of Object.entries(this.value)) {
      if (!clearUndefined || typeof text !== 'undefined') {
        result[path ? `${path}${separator}${key}` : key] = text;
      }
    }
    return result;
  }

  toJSON() {
    return this.value;
  }
}

describe('Test diff()', () => {

  test('common', () => {

    let first = {
      name: 1,
      profile: {
        surname: 'x',
        avatar: {
          code: 1,
          url: 'xxx',
          list: [
            {a: 0},
            1,
            null,
          ],
          i18n: new Custom({x: undefined, ru: 'RU', en: 'EN'}),
        },
      },
      date: new Date('2021-01-26T23:41:59.433Z'),
      parent: {_id: 'null'},
      i18n: new Custom({ru: 'RU', en: 'EN'}),
      some: 1,
      someDeep: {
        deep: {
          superdeep: [200],
        },
      },
    };

    let second = {
      name: 2,
      profile: {
        surname2: 'x',
        avatar: {
          code: 1,
          url: 'xxx',
          list: [0, 1, 2],
          i18n: new Custom({x: undefined, ru: 'GB', en: 'EN'}),
        },
      },
      date: new Date('2021-01-26T23:41:59.433Z'),
      parent: {_id: 'null'},
      i18n: new Custom({ru: 'RU', en: 'EN'}),
      newV: {
        some: {
          dd: 100,
          x: {
            gg: 200,
          },
        },
      },
    };

    const diff = utils.diff(first, second);

    expect(utils.toPlain(diff)).toEqual({
      $set: {
        'name': 2,
        'profile.surname2': 'x',
        'profile.avatar.list': [0, 1, 2],
        'profile.avatar.i18n.ru': 'GB',
        'date': '2021-01-26T23:41:59.433Z',
        'newV': {
          'some': {
            'dd': 100,
            'x': {
              'gg': 200,
            },
          },
        },
      },
      $unset: [
        'profile.surname',
        'some',
        'someDeep',
      ],
    });

    // Merge first object with diff
    const updated = mc.merge(utils.toPlain(first), diff);

    expect(utils.toPlain(updated)).toEqual(utils.toPlain(second));
  });


  test('with ignore', () => {

    let first = {
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

    let second = {
      name: 2,
      profile: {
        newSurname: 'x',
        avatar: {
          code: 1,
          url: 'xxx',
        },
      }
    };

    const diff = utils.diff(first, second, ['someDeep', 'profile.avatar.url']);

    expect(utils.toPlain(diff)).toEqual({
      $set: {
        "name": 2,
        "profile.newSurname": "x",
        //"profile.avatar.url": "xxx"
      },
      $unset: [
        "profile.surname",
        //"someDeep"
      ]
    });
  });


  test('simple', () => {
    const first = {
      name: 'value',
      profile: {
        surname: 'Surname',
        birthday: new Date(),
        avatar: {
          url: 'pic.png'
        }
      },
      access: [100, 350, 200]
    }

    const second = {
      login: 'value',
      profile: {
        surname: 'Surname2',
        avatar: {
          url: 'new/pic.png'
        }
      },
      access: [700]
    }

    const diff = utils.diff(first, second, '/');

    console.log(diff);

    expect(diff).toEqual({
      $set: {
        'login': 'value',
        'profile.surname': 'Surname2',
        'profile.avatar.url': 'new/pic.png',
        'access': [ 700 ]
      },
      $unset: [
        'profile.birthday',
        'name'
      ]
    });
  })
});
