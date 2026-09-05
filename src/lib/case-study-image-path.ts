// Only accept image paths this same admin's upload-image route could have
// produced — not an arbitrary attacker-supplied path.
export const CASE_STUDY_IMAGE_PATH_PATTERN =
  /^\/images\/case-studies\/[a-z0-9-]+\.(jpg|jpeg|png|webp|gif)$/i;
