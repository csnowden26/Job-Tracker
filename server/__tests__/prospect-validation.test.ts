import { validateProspect } from "../prospect-helpers";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
      salary: "$100,000",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
      salary: "$100,000",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });

  describe("salary validation", () => {
    test("rejects a missing salary", () => {
      const result = validateProspect({
        companyName: "Google",
        roleTitle: "Software Engineer",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary is required");
    });

    test("rejects an empty salary string", () => {
      const result = validateProspect({
        companyName: "Google",
        roleTitle: "Software Engineer",
        salary: "",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary is required");
    });

    test("rejects a whitespace-only salary", () => {
      const result = validateProspect({
        companyName: "Google",
        roleTitle: "Software Engineer",
        salary: "   ",
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary is required");
    });

    test("rejects null salary", () => {
      const result = validateProspect({
        companyName: "Google",
        roleTitle: "Software Engineer",
        salary: null,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Salary is required");
    });

    test("accepts a valid salary string", () => {
      const result = validateProspect({
        companyName: "Google",
        roleTitle: "Software Engineer",
        salary: "$120,000",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts a salary range", () => {
      const result = validateProspect({
        companyName: "Meta",
        roleTitle: "Product Manager",
        salary: "90k–110k",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("accepts a numeric salary string", () => {
      const result = validateProspect({
        companyName: "Stripe",
        roleTitle: "Engineer",
        salary: "150000",
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
