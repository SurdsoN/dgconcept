const GITHUB_API = "https://api.github.com";

// The branch Vercel deploys from. Override with GITHUB_BRANCH if that ever
// changes (e.g. after switching the repo's default branch to "main").
const DEFAULT_BRANCH = "claude/website-design-requirements-x0up25";

type GitHubConfig = {
  token: string;
  repo: string;
  branch: string;
};

function getConfig(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPO must be configured");
  }
  return { token, repo, branch: process.env.GITHUB_BRANCH || DEFAULT_BRANCH };
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Reads a file straight from GitHub (the true current state, not whatever
// this serverless instance last deployed) so edits always start from the
// latest content and updates always carry the right sha.
export async function getFileFromGitHub(
  path: string,
): Promise<{ content: string; sha: string } | null> {
  const { token, repo, branch } = getConfig();
  const res = await fetch(
    `${GITHUB_API}/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    { headers: githubHeaders(token) },
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub lookup failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { content: string; sha: string };
  return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha };
}

// Creates a new file, or replaces one when `sha` (from getFileFromGitHub)
// is given — GitHub's Contents API requires the current sha to update a
// file, otherwise it rejects the write as a conflict.
export async function upsertFileOnGitHub(
  path: string,
  base64Content: string,
  message: string,
  sha?: string,
): Promise<void> {
  const { token, repo, branch } = getConfig();
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...githubHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: base64Content,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub publish failed (${res.status}): ${await res.text()}`);
  }
}
