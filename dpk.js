const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  // Assign the trivial partition key to the candidate
  let candidate = TRIVIAL_PARTITION_KEY;

  // Check if event is defined and have a partitionKey property
  if (event && event.partitionKey) {
    // If the event contains a partitionKey property, assign it to candidate
    candidate = event.partitionKey;
    // if the event does not have a partitionKey property
  } else if (event) {
    // Stringify the event
    const data = JSON.stringify(event);
    // Hash the stringified event and assign it to candidate
    candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }

  // Check if candidate is defined and is a string
  if (typeof candidate !== "string") {
    // If candidate is not a string, stringify it
    candidate = JSON.stringify(candidate);
  }

  // Check if the candidate is longer than the max partition key length
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    // If it is, hash the candidate and assign it to itself
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  // Return the candidate
  return candidate;
};

/**
 * I started by simplifying the conditionals to be more readable.
 * Instead of nesting if statements, I used if-else if-else structure to make the flow of the function easier to follow.
 * I also removed unnecessary code by setting the initial value of "candidate" to the trivial partition key "0", so it is not necessary to check if it is defined.
 * I then simplified the code that converts "candidate" to a string by checking the typeof "candidate" instead of checking if it exists and then using JSON.stringify.
 * Lastly, I added comments to describe each section of the function and made sure that the variable names are self-explanatory.
 * Overall, my version of the function is more readable because the code is now easier to follow with clear conditional statements and comments.
 * The code is also shorter and more concise, making it easier to read and understand.
 */