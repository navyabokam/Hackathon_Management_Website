import { describe, it, expect } from 'vitest';
import { generateRegistrationId, generateTransactionRef } from './id-generator';

describe('ID Generators', () => {
  describe('generateRegistrationId', () => {
    it('should generate a valid registration ID', () => {
      const id = generateRegistrationId();
      expect(id).toMatch(/^HACK-\d{4}-[A-Z0-9]{6}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateRegistrationId();
      const id2 = generateRegistrationId();
      expect(id1).not.toBe(id2);
    });

    it('should include current year', () => {
      const id = generateRegistrationId();
      const year = new Date().getFullYear();
      expect(id).toContain(`HACK-${year}`);
    });
  });

  describe('generateTransactionRef', () => {
    it('should generate a valid transaction reference', () => {
      const ref = generateTransactionRef();
      expect(ref).toMatch(/^TXN-\d+-[A-Z0-9]{8}$/);
    });

    it('should generate unique references', () => {
      const ref1 = generateTransactionRef();
      const ref2 = generateTransactionRef();
      expect(ref1).not.toBe(ref2);
    });
  });
});
