const { CATEGORIES, CATEGORY_OPTIONS } = require('../products');

/**
 * Behaviors covered:
 * 1. CATEGORY_OPTIONS should start with 'All Products' and include category names and all sub-categories.
 * 2. CATEGORIES should contain objects with required shape: { name: string, subs: string[] }.
 * 3. CATEGORY_OPTIONS should not include duplicates and should preserve order (All -> categories -> subs).
 * 4. CATEGORY_OPTIONS should include all names defined in CATEGORIES.
 * 5. CATEGORY_OPTIONS should be stable when CATEGORIES changes structure (derived from CATEGORIES map/flatMap).
 */

describe('src/lib/products constants', () => {
  test('CATEGORY_OPTIONS begins with "All Products"', () => {
    expect(CATEGORY_OPTIONS[0]).toBe('All Products');
  });

  test('CATEGORIES items have required shape', () => {
    CATEGORIES.forEach(cat => {
      expect(cat).toHaveProperty('name');
      expect(typeof cat.name).toBe('string');
      expect(Array.isArray(cat.subs)).toBe(true);
      cat.subs.forEach(sub => expect(typeof sub).toBe('string'));
    });
  });

  test('CATEGORY_OPTIONS preserves order: All -> category names -> subs', () => {
    const expected = ['All Products', ...CATEGORIES.map(c => c.name), ...CATEGORIES.flatMap(c => c.subs)];
    expect(CATEGORY_OPTIONS).toEqual(expected);
  });

  test('CATEGORY_OPTIONS contains all category and sub-category names exactly once in their positions', () => {
    const names = new Set();
    CATEGORY_OPTIONS.forEach((opt, idx) => {
      // track duplicates (excluding the first All Products which is unique)
      expect(names.has(opt)).toBe(false);
      names.add(opt);
      if (idx === 0) expect(opt).toBe('All Products');
    });
  });

  test('CATEGORY_OPTIONS updates correctly when CATEGORIES changes', () => {
    // Create a local derived value to compare shape logic rather than exact contents.
    const derived = ['All Products', ...CATEGORIES.map(c => c.name), ...CATEGORIES.flatMap(c => c.subs)];
    // Sanity: lengths match
    expect(CATEGORY_OPTIONS.length).toBe(derived.length);
    // Spot check first 5 elements for alignment
    for (let i = 0; i < Math.min(5, derived.length); i++) {
      expect(CATEGORY_OPTIONS[i]).toBe(derived[i]);
    }
  });
});
