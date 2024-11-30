import { getObservation, saveObservationFHIR } from "../services/FHIRService";

describe("FHIRService Integration with real FHIRClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and process an Observation resource correctly from the mock file", async () => {
    process.env.USE_MOCK_DATA = "true";
    const observationId = "blood-pressure-123";
    const result = await getObservation(observationId);
    const expected = {
      id: "blood-pressure-123",
      status: "final",
      effectiveDate: "2024-11-01T08:30:00+00:00",
      systolic: 120,
      diastolic: 80,
    };
    expect(result).toEqual(expected);
  });

  it("should throw an error if the Observation resource is invalid", async () => {
    process.env.USE_MOCK_DATA = "true";
    const invalidObservationId = "nonexistent-id";

    await expect(getObservation(invalidObservationId)).rejects.toThrow(
      "Resource Observation/nonexistent-id not found in mock data"
    );
  });

  it("should fetch an Observation from the FHIR server (if server is running)", async () => {
    process.env.USE_MOCK_DATA = "false";
    const observationId = "some-real-observation-id";
    const result = await getObservation(observationId);

    expect(result).toHaveProperty("id", observationId);
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("effectiveDate");
    expect(result).toHaveProperty("systolic");
    expect(result).toHaveProperty("diastolic");
  });

  it("should save reading to file in FHIR JSON format", async () => {
    const result = await saveObservationFHIR(130,90,"2024-11-20T08:30:00+00:00",1);

    expect(result).toHaveProperty("id", 1);
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("effectiveDate");
    expect(result).toHaveProperty("systolic");
    expect(result).toHaveProperty("diastolic");
  });
});