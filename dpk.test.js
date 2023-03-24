const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  test('should return a partition key of length <= 256', () => {
    const event = {
      name: 'Test Event',
      description: 'This is a test event for unit testing deterministicPartitionKey function'
    };
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey.length).toBeLessThanOrEqual(256);
  });

  test('should return a trivial partition key if event is not provided', () => {
    const partitionKey = deterministicPartitionKey();
    expect(partitionKey).toBe('0');
  });

  test('should return the same partition key if event already has a partition key', () => {
    const event = {
      partitionKey: 'existing-partition-key',
      name: 'Test Event',
      description: 'This is a test event for unit testing deterministicPartitionKey function'
    };
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe('existing-partition-key');
  });

  test('should return a hash of the event data if event does not have a partition key', () => {
    const event = {
      name: 'Test Event',
      description: 'This is a test event for unit testing deterministicPartitionKey function'
    };
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).not.toBe('0');
    expect(partitionKey).toMatch(/[a-f0-9]{128}/);
  });

  test('should stringify non-string partition key candidates', () => {
    const event = {
      partitionKey: 123,
      name: 'Test Event',
      description: 'This is a test event for unit testing deterministicPartitionKey function'
    };
    const partitionKey = deterministicPartitionKey(event);
    expect(partitionKey).toBe('123');
  });

  test('should hash partition key candidates longer than 256 characters', () => {
    const partitionKey = 'a'.repeat(257);
    const event = {
      partitionKey,
      name: 'Test Event',
      description: 'This is a test event for unit testing deterministicPartitionKey function'
    };
    const hashedPartitionKey = deterministicPartitionKey(event);
    expect(hashedPartitionKey).not.toBe(partitionKey);
    expect(hashedPartitionKey).toMatch(/[a-f0-9]{128}/);
  });

  describe("when called with null or undefined", () => {
    it("returns the trivial partition key", () => {
      expect(deterministicPartitionKey(null)).toBe("0");
      expect(deterministicPartitionKey(undefined)).toBe("0");
    });
  });

  describe("when called with an object or an array", () => {
    it("returns a deterministic hash of the JSON representation", () => {
      const obj = { a: 1, b: "foo" };
      const arr = ["hello", 42, { c: true }];

      expect(deterministicPartitionKey(obj)).toBe(
          crypto.createHash("sha3-512").update(JSON.stringify(obj)).digest("hex")
      );
      expect(deterministicPartitionKey(arr)).toBe(
          crypto.createHash("sha3-512").update(JSON.stringify(arr)).digest("hex")
      );
    });
  });

  describe("when called with an event that already has a partition key", () => {
    it("returns that partition key", () => {
      const event = { partitionKey: "myPartitionKey" };
      expect(deterministicPartitionKey(event)).toBe("myPartitionKey");
    });
  });

  describe("when called with an event that doesn't have a partition key", () => {
    it("returns a deterministic hash of the event data", () => {
      const event = { foo: "bar", baz: 42 };
      const expectedHash = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");

      expect(deterministicPartitionKey(event)).toBe(expectedHash);
    });
  });

  describe("when crypto.createHash throws an error", () => {
    it("returns the trivial partition key", () => {
      const mockCreateHash = jest.spyOn(crypto, "createHash").mockImplementationOnce(() => {
        throw new Error("Hash algorithm not supported");
      });
      const error = new Error("Hash algorithm not supported");

      try {
        deterministicPartitionKey({ foo: "bar" });
      } catch (e) {
        expect(e).toStrictEqual(error);
      }

      mockCreateHash.mockRestore();
    });
  });
});
