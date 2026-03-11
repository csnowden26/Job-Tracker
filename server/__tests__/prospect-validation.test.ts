import { validateProspect } from "../prospect-helpers";

const baseValid = {
  companyName: "Google",
  roleTitle: "Software Engineer",
  salary: "$120,000",
  contactName: "Jane Smith",
  contactPhone: "555-867-5309",
};

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({ ...baseValid, companyName: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({ ...baseValid, roleTitle: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });

  describe("salary validation", () => {
    test("rejects a missing salary", () => {
      const { salary, ...rest } = baseValid;
      const result = validateProspect(rest);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary is required");
    });

    test("rejects an empty salary string", () => {
      const result = validateProspect({ ...baseValid, salary: "" });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary is required");
    });

    test("rejects a whitespace-only salary", () => {
      const result = validateProspect({ ...baseValid, salary: "   " });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary is required");
    });

    test("rejects null salary", () => {
      const result = validateProspect({ ...baseValid, salary: null });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary is required");
    });

    test("accepts a valid salary string", () => {
      const result = validateProspect({ ...baseValid, salary: "$120,000" });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts a salary range", () => {
      const result = validateProspect({ ...baseValid, companyName: "Meta", roleTitle: "Product Manager", salary: "90k–110k" });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts a numeric salary string", () => {
      const result = validateProspect({ ...baseValid, companyName: "Stripe", roleTitle: "Engineer", salary: "150000" });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("point of contact validation", () => {
    test("rejects a missing contact name", () => {
      const { contactName, ...rest } = baseValid;
      const result = validateProspect(rest);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Point of contact name is required");
    });

    test("rejects an empty contact name", () => {
      const result = validateProspect({ ...baseValid, contactName: "" });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Point of contact name is required");
    });

    test("rejects a whitespace-only contact name", () => {
      const result = validateProspect({ ...baseValid, contactName: "   " });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Point of contact name is required");
    });

    test("rejects when neither phone nor email is provided", () => {
      const result = validateProspect({
        ...baseValid,
        contactPhone: undefined,
        contactEmail: undefined,
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("At least one contact method (phone or email) is required");
    });

    test("rejects when both phone and email are empty strings", () => {
      const result = validateProspect({
        ...baseValid,
        contactPhone: "",
        contactEmail: "",
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("At least one contact method (phone or email) is required");
    });

    test("rejects when both phone and email are whitespace only", () => {
      const result = validateProspect({
        ...baseValid,
        contactPhone: "   ",
        contactEmail: "   ",
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("At least one contact method (phone or email) is required");
    });

    test("accepts when only phone is provided", () => {
      const result = validateProspect({
        ...baseValid,
        contactPhone: "555-867-5309",
        contactEmail: undefined,
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts when only email is provided", () => {
      const result = validateProspect({
        ...baseValid,
        contactPhone: undefined,
        contactEmail: "jane@example.com",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts when both phone and email are provided", () => {
      const result = validateProspect({
        ...baseValid,
        contactPhone: "555-867-5309",
        contactEmail: "jane@example.com",
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
