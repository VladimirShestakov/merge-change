import { ExtractPaths } from '../types';

// Test object from types.ts
type Testobject = {
  z: {
    m: {
      c: string;
    };
  };
  gg: boolean;
};

// Test with dot separator
type TestPathsDot = ExtractPaths<Testobject, '.'>;
const pathDot: TestPathsDot = 'z.m.c'; // This should work
const pathDotWithLeadingSeparator: TestPathsDot = '.z.m.c'; // This should work with our new fix

// Test with slash separator
type TestPathsSlash = ExtractPaths<Testobject, '/'>;
const pathSlash: TestPathsSlash = 'z/m/c'; // This should now work with our fix
const pathSlashWithLeadingSeparator: TestPathsSlash = '/z/m/c'; // This should work with our new fix

// Test with two colon separators
type TestPathsColon = ExtractPaths<Testobject, '::'>;
const pathColon: TestPathsColon = 'z::m::c'; // This should also work
const pathColonWithLeadingSeparator: TestPathsColon = '::z::m::c'; // This should work with our new fix
