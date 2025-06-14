import {
  ExtractPaths,
  ExtractPathsStarted,
  ExtractPathsLeaf,
  PathToType,
  ExtractPathsAny,
} from '../types';

// Test object
type TestObject = {
  a: number;
  b: {
    c: string;
    d: {
      e: boolean;
    };
  };
  f: string[];
  g: Array<{ h: number }>;
};

type TestObjectPartial = {
  a?: number;
  b?: {
    c: string;
    d: {
      e?: boolean;
    };
  };
  f?: string[];
  g?: Array<{ h?: number }>;
};

// ==================== ExtractPaths Tests ====================
// Test with dot separator
type TestPaths = ExtractPaths<TestObject, '.'>;

// These should be valid paths
const path1: TestPaths = 'a';
const path2: TestPaths = 'b';
const path3: TestPaths = 'b.c';
const path4: TestPaths = 'b.d';
const path5: TestPaths = 'b.d.e';
const path6: TestPaths = 'f';
const path7: TestPaths = 'f.0';
const path8: TestPaths = 'g';
const path9: TestPaths = 'g.0';
const path10: TestPaths = 'g.0.h';

// These should not be valid paths
// @ts-expect-error - 'x' is not a valid path
const invalidPath1: TestPaths = 'x';
// @ts-expect-error - 'b.x' is not a valid path
const invalidPath2: TestPaths = 'b.x';
// @ts-expect-error - 'f.x' is not a valid path (array indices must be numbers)
const invalidPath3: TestPaths = 'f.x';

// Test with slash separator
type TestPathsSlash = ExtractPaths<TestObject, '/'>;

// These should be valid paths
const pathSlash1: TestPathsSlash = 'a';
const pathSlash2: TestPathsSlash = 'b';
const pathSlash3: TestPathsSlash = 'b/c';
const pathSlash4: TestPathsSlash = 'b/d';
const pathSlash5: TestPathsSlash = 'b/d/e';
const pathSlash6: TestPathsSlash = 'f';
const pathSlash7: TestPathsSlash = 'f/0';
const pathSlash8: TestPathsSlash = 'g';
const pathSlash9: TestPathsSlash = 'g/0';
const pathSlash10: TestPathsSlash = 'g/0/h';

type TestPathsPartial = ExtractPaths<TestObjectPartial, '.'>;

// These should be valid paths
const pathPartial1: TestPathsPartial = 'a';
const pathPartial2: TestPathsPartial = 'b';
const pathPartial3: TestPathsPartial = 'b.c';
const pathPartial4: TestPathsPartial = 'b.d';
const pathPartial5: TestPathsPartial = 'b.d.e';
const pathPartial6: TestPathsPartial = 'f';
const pathPartial7: TestPathsPartial = 'f.0';
const pathPartial8: TestPathsPartial = 'g';
const pathPartial9: TestPathsPartial = 'g.0';
const pathPartial10: TestPathsPartial = 'g.0.h';

// ==================== ExtractPathsStarted Tests ====================
// Test with dot separator
type TestPathsStarted = ExtractPathsStarted<TestObject, '.'>;

// These should be valid paths
const startedPath1: TestPathsStarted = '.a';
const startedPath2: TestPathsStarted = '.b';
const startedPath3: TestPathsStarted = '.b.c';
const startedPath4: TestPathsStarted = '.b.d';
const startedPath5: TestPathsStarted = '.b.d.e';
const startedPath6: TestPathsStarted = '.f';
const startedPath7: TestPathsStarted = '.f.0';
const startedPath8: TestPathsStarted = '.g';
const startedPath9: TestPathsStarted = '.g.0';
const startedPath10: TestPathsStarted = '.g.0.h';

// These should not be valid paths
// @ts-expect-error - 'a' is not a valid path (missing starting separator)
const invalidStartedPath1: TestPathsStarted = 'a';
// @ts-expect-error - '.x' is not a valid path
const invalidStartedPath2: TestPathsStarted = '.x';
// @ts-expect-error - '.b.x' is not a valid path
const invalidStartedPath3: TestPathsStarted = '.b.x';

// Test with slash separator
type TestPathsStartedSlash = ExtractPathsStarted<TestObject, '/'>;

// These should be valid paths
const startedPathSlash1: TestPathsStartedSlash = '/a';
const startedPathSlash2: TestPathsStartedSlash = '/b';
const startedPathSlash3: TestPathsStartedSlash = '/b/c';
const startedPathSlash4: TestPathsStartedSlash = '/b/d';
const startedPathSlash5: TestPathsStartedSlash = '/b/d/e';
const startedPathSlash6: TestPathsStartedSlash = '/f';
const startedPathSlash7: TestPathsStartedSlash = '/f/0';
const startedPathSlash8: TestPathsStartedSlash = '/g';
const startedPathSlash9: TestPathsStartedSlash = '/g/0';
const startedPathSlash10: TestPathsStartedSlash = '/g/0/h';

// ==================== ExtractPathsAny Tests ====================
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
type TestPathsDot = ExtractPathsAny<Testobject, '.'>;
const pathDot: TestPathsDot = 'z.m.c'; // This should work
const pathDotWithLeadingSeparator: TestPathsDot = '.z.m.c'; // This should work with our new fix

// Test with slash separator
type TestPathsAnySlash = ExtractPathsAny<Testobject, '/'>;
const pathAnySlash: TestPathsAnySlash = 'z/m/c'; // This should now work with our fix
const pathAnySlashWithLeadingSeparator: TestPathsAnySlash = '/z/m/c'; // This should work with our new fix

// Test with two colon separators
type TestPathsAnyColon = ExtractPathsAny<Testobject, '::'>;
const pathAnyColon: TestPathsAnyColon = 'z::m::c'; // This should also work
const pathAnyColonWithLeadingSeparator: TestPathsAnyColon = '::z::m::c'; // This should work with our new fix

// ==================== ExtractPathsLeaf Tests ====================
// Test with dot separator
type TestPathsLeaf = ExtractPathsLeaf<TestObject, '.'>;

// These should be the only valid paths
const pathLeaf1: TestPathsLeaf = 'a';
const pathLeaf2: TestPathsLeaf = 'b.c';
const pathLeaf3: TestPathsLeaf = 'b.d.e';
const pathLeaf4: TestPathsLeaf = 'f';

// These should not be valid paths
// @ts-expect-error - 'b' is not a leaf path
const invalidPath1: TestPathsLeaf = 'b';
// @ts-expect-error - 'b.d' is not a leaf path
const invalidPath2: TestPathsLeaf = 'b.d';
// @ts-expect-error - 'f.0' is not a valid path (array elements are not considered)
const invalidPath3: TestPathsLeaf = 'f.0';

// Test with different separator
type TestPathsLeafSlash = ExtractPathsLeaf<TestObject, '/'>;
const pathLeafSlash1: TestPathsLeafSlash = 'a';
const pathLeafSlash2: TestPathsLeafSlash = 'b/c';
const pathLeafSlash3: TestPathsLeafSlash = 'b/d/e';
const pathLeafSlash4: TestPathsLeafSlash = 'f';

// Test with dot separator
type TestPathsPartialLeaf = ExtractPathsLeaf<TestObjectPartial, '.'>;

// These should be the only valid paths
const pathPartialLeaf1: TestPathsPartialLeaf = 'a';
const pathPartialLeaf2: TestPathsPartialLeaf = 'b.c';
const pathPartialLeaf3: TestPathsPartialLeaf = 'b.d.e';
const pathPartialLeaf4: TestPathsPartialLeaf = 'f';

// These should not be valid paths
// @ts-expect-error - 'b' is not a leaf path
const invalidPartialPath1: TestPathsPartialLeaf = 'b';
// @ts-expect-error - 'b.d' is not a leaf path
const invalidPartialPath2: TestPathsPartialLeaf = 'b.d';
// @ts-expect-error - 'f.0' is not a valid path (array elements are not considered)
const invalidPartialPath3: TestPathsPartialLeaf = 'f.0';

// ==================== PathToType Tests ====================
// Test with dot separator
// Simple property access
type AType = PathToType<TestObject, 'a', '.'>;
const aValue: AType = 42; // Should be number

// Nested property access
type BCType = PathToType<TestObject, 'b.c', '.'>;
const bcValue: BCType = 'test'; // Should be string

type BDEType = PathToType<TestObject, 'b.d.e', '.'>;
const bdeValue: BDEType = true; // Should be boolean

// Array access
type F0Type = PathToType<TestObject, 'f.0', '.'>;
const f0Value: F0Type = 'test'; // Should be string

// Array of objects access
type G0Type = PathToType<TestObject, 'g.0', '.'>;
const g0Value: G0Type = { h: 42 }; // Should be { h: number }

type G0HType = PathToType<TestObject, 'g.0.h', '.'>;
const g0hValue: G0HType = 42; // Should be number

// Test with slash separator
type ATypeSlash = PathToType<TestObject, 'a', '/'>;
const aValueSlash: ATypeSlash = 42; // Should be number

type BCTypeSlash = PathToType<TestObject, 'b/c', '/'>;
const bcValueSlash: BCTypeSlash = 'test'; // Should be string

type BDETypeSlash = PathToType<TestObject, 'b/d/e', '/'>;
const bdeValueSlash: BDETypeSlash = true; // Should be boolean

// Test with leading separator
type LeadingSepType = PathToType<TestObject, '.a', '.'>;
const leadingSepValue: LeadingSepType = 42; // Should be number

// Invalid paths should result in undefined
type InvalidType = PathToType<TestObject, 'x', '.'>;
// @ts-expect-error - 'x' is not a valid path, so type should be undefined
const invalidValue: InvalidType = 42;

// Test with an empty string path
type EmptyPathType = PathToType<TestObject, '', '.'>;
// Should be the original object type
const emptyPathValue: EmptyPathType = {
  a: 42,
  b: {
    c: 'test',
    d: {
      e: true,
    },
  },
  f: ['test'],
  g: [{ h: 42 }],
};
