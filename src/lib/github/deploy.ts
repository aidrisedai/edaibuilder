const GITHUB_API = "https://api.github.com";

interface DeployResult {
  repoUrl: string;
  pagesUrl: string;
}

export async function deployToGithubPages(
  projectSlug: string,
  htmlContent: string,
  githubToken: string,
  githubOrg: string
): Promise<DeployResult> {
  const repoName = `edai-${projectSlug}`;
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  // Step 1: Create or get repo
  let repoFullName: string;
  try {
    const createRes = await fetch(`${GITHUB_API}/orgs/${githubOrg}/repos`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: repoName,
        description: "Built with EdAIBuilder",
        private: false,
        auto_init: true,
      }),
    });

    if (createRes.status === 422) {
      // Repo already exists
      repoFullName = `${githubOrg}/${repoName}`;
    } else if (!createRes.ok) {
      // Try as user repo instead of org
      const userRes = await fetch(`${GITHUB_API}/user/repos`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: repoName,
          description: "Built with EdAIBuilder",
          private: false,
          auto_init: true,
        }),
      });

      if (userRes.status === 422) {
        const userInfo = await fetch(`${GITHUB_API}/user`, { headers });
        const userData = await userInfo.json();
        repoFullName = `${userData.login}/${repoName}`;
      } else if (userRes.ok) {
        const data = await userRes.json();
        repoFullName = data.full_name;
      } else {
        throw new Error("Failed to create repository");
      }
    } else {
      const data = await createRes.json();
      repoFullName = data.full_name;
    }
  } catch (error) {
    throw new Error(`Repository creation failed: ${error}`);
  }

  // Step 2: Get current file SHA (if exists) for updating
  let fileSha: string | undefined;
  try {
    const fileRes = await fetch(
      `${GITHUB_API}/repos/${repoFullName}/contents/index.html`,
      { headers }
    );
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      fileSha = fileData.sha;
    }
  } catch {
    // File doesn't exist yet, that's fine
  }

  // Step 3: Push index.html
  const content = Buffer.from(htmlContent).toString("base64");
  const pushRes = await fetch(
    `${GITHUB_API}/repos/${repoFullName}/contents/index.html`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "Deploy from EdAIBuilder",
        content,
        ...(fileSha ? { sha: fileSha } : {}),
      }),
    }
  );

  if (!pushRes.ok) {
    const err = await pushRes.text();
    throw new Error(`Failed to push code: ${err}`);
  }

  // Step 4: Enable GitHub Pages
  try {
    await fetch(`${GITHUB_API}/repos/${repoFullName}/pages`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        build_type: "legacy",
        source: {
          branch: "main",
          path: "/",
        },
      }),
    });
  } catch {
    // Pages might already be enabled
  }

  const [owner] = repoFullName.split("/");
  return {
    repoUrl: `https://github.com/${repoFullName}`,
    pagesUrl: `https://${owner}.github.io/${repoName}`,
  };
}
