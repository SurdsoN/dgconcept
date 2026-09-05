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

export async function fileExistsOnGitHub(path: string): Promise<boolean> {
  const { token, repo, branch } = getConfig();
  const res = await fetch(
    `${GITHUB_API}/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    { headers: githubHeaders(token) },
  );
  if (res.status === 404) return false;
  if (res.ok) return true;
  throw new Error(`GitHub lookup failed (${res.status}): ${await res.text()}`);
}

export async function createFileOnGitHub(
  path: string,
  content: string,
  message: string,
): Promise<void> {
  const { token, repo, branch } = getConfig();
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...githubHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub publish failed (${res.status}): ${await res.text()}`);
  }
}
